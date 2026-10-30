# -*- coding: utf-8 -*-
"""
معمارية النموذج اللغوي المستقل الخاص بعبقرينو Studio Ultimate
Abqarino Dense Decoder Architecture (PyTorch Reference Implementation)
الباب السادس: النموذج اللغوي المستقل الخاص بعبقرينو
"""

import math
import torch
import torch.nn as nn
import torch.nn.functional as F

class RMSNorm(nn.Module):
    def __init__(self, dim: int, eps: float = 1e-6):
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.ones(dim))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        variance = x.pow(2).mean(-1, keepdim=True)
        return x * torch.rsqrt(variance + self.eps) * self.weight

class RotaryEmbedding(nn.Module):
    def __init__(self, dim: int, max_seq_len: int = 8192):
        super().__init__()
        inv_freq = 1.0 / (10000 ** (torch.arange(0, dim, 2).float() / dim))
        t = torch.arange(max_seq_len, dtype=torch.float32)
        freqs = torch.outer(t, inv_freq)
        self.register_buffer("cos", freqs.cos())
        self.register_buffer("sin", freqs.sin())

    def forward(self, q, k):
        seq_len = q.shape[1]
        cos = self.cos[:seq_len].unsqueeze(0).unsqueeze(2)
        sin = self.sin[:seq_len].unsqueeze(0).unsqueeze(2)
        
        q_rot = (q * cos) + (self._rotate_half(q) * sin)
        k_rot = (k * cos) + (self._rotate_half(k) * sin)
        return q_rot, k_rot

    def _rotate_half(self, x):
        x1 = x[..., :x.shape[-1] // 2]
        x2 = x[..., x.shape[-1] // 2:]
        return torch.cat((-x2, x1), dim=-1)

class AbqarinoAttention(nn.Module):
    def __init__(self, d_model: int = 1024, n_heads: int = 16, dropout: float = 0.1):
        super().__init__()
        self.d_model = d_model
        self.n_heads = n_heads
        self.head_dim = d_model // n_heads
        
        self.q_proj = nn.Linear(d_model, d_model, bias=False)
        self.k_proj = nn.Linear(d_model, d_model, bias=False)
        self.v_proj = nn.Linear(d_model, d_model, bias=False)
        self.out_proj = nn.Linear(d_model, d_model, bias=False)
        self.dropout = nn.Dropout(dropout)
        self.rotary = RotaryEmbedding(self.head_dim)

    def forward(self, x: torch.Tensor, mask: torch.Tensor = None) -> torch.Tensor:
        b, s, d = x.shape
        q = self.q_proj(x).view(b, s, self.n_heads, self.head_dim)
        k = self.k_proj(x).view(b, s, self.n_heads, self.head_dim)
        v = self.v_proj(x).view(b, s, self.n_heads, self.head_dim)

        q, k = self.rotary(q, k)

        q = q.transpose(1, 2)
        k = k.transpose(1, 2)
        v = v.transpose(1, 2)

        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(self.head_dim)
        if mask is not None:
            scores = scores + mask
        attn_weights = F.softmax(scores, dim=-1)
        attn_weights = self.dropout(attn_weights)
        
        context = torch.matmul(attn_weights, v)
        context = context.transpose(1, 2).contiguous().view(b, s, d)
        return self.out_proj(context)

class AbqarinoMLP(nn.Module):
    def __init__(self, d_model: int = 1024, hidden_dim: int = 4096):
        super().__init__()
        self.gate_proj = nn.Linear(d_model, hidden_dim, bias=False)
        self.up_proj = nn.Linear(d_model, hidden_dim, bias=False)
        self.down_proj = nn.Linear(hidden_dim, d_model, bias=False)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.down_proj(F.silu(self.gate_proj(x)) * self.up_proj(x))

class AbqarinoTransformerBlock(nn.Module):
    def __init__(self, d_model: int = 1024, n_heads: int = 16):
        super().__init__()
        self.attn_norm = RMSNorm(d_model)
        self.attn = AbqarinoAttention(d_model, n_heads)
        self.mlp_norm = RMSNorm(d_model)
        self.mlp = AbqarinoMLP(d_model)

    def forward(self, x: torch.Tensor, mask: torch.Tensor = None) -> torch.Tensor:
        h = x + self.attn(self.attn_norm(x), mask)
        out = h + self.mlp(self.mlp_norm(h))
        return out

class AbqarinoModel(nn.Module):
    """
    نموذج عبقرينو الأساسي المستقل:
    - حجم المفردات: 32,000 وحدة (عربي/إنجليزي/شيفرات)
    - سياق الذاكرة: 8,192 وحدة
    - أبعاد النموذج: 1024
    - عدد الطبقات: 16 طبقة
    - عدد الرؤوس: 16 رأس
    - إجمالي المعاملات: ~125 مليون معامل
    """
    def __init__(self, vocab_size: int = 32000, d_model: int = 1024, n_layers: int = 16, n_heads: int = 16):
        super().__init__()
        self.vocab_size = vocab_size
        self.embed_tokens = nn.Embedding(vocab_size, d_model)
        self.layers = nn.ModuleList([AbqarinoTransformerBlock(d_model, n_heads) for _ in range(n_layers)])
        self.norm = RMSNorm(d_model)
        self.lm_head = nn.Linear(d_model, vocab_size, bias=False)
        self.embed_tokens.weight = self.lm_head.weight # Weight tying

    def forward(self, input_ids: torch.Tensor) -> torch.Tensor:
        b, s = input_ids.shape
        x = self.embed_tokens(input_ids)
        mask = torch.triu(torch.full((s, s), float('-inf'), device=input_ids.device), diagonal=1)
        
        for layer in self.layers:
            x = layer(x, mask)
            
        x = self.norm(x)
        logits = self.lm_head(x)
        return logits
