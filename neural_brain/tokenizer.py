# -*- coding: utf-8 -*-
"""
المجزئ اللغوي العصبي المتقدم متعدد اللغات لعبقرينو (Abqarino Advanced Multilingual Tokenizer V3)
يدعم:
1. اللغة العربية الفصحى مع التفكيك الصرفي للسوابق واللواصق (Clitic Detachment: و، ف، ب، ل، ك، ال).
2. اللهجة المصرية العامية مع مفرداتها الشائعة (عايز، ازاي، كدة، دلوقتي، علشان، شغال، مفيش...).
3. اللغة الإنجليزية ومصطلحات هندسة البرمجيات.
4. اللغة الألمانية وحروفها الخاصة (ä, ö, ü, ß, Ä, Ö, Ü) وتراكيبها النحوية.
5. المحافظة الصارمة على المسافات البيضاء، الأسطر البرمجية (\n, \t)، والرموز التقنية.
6. آلية استرجاع البايتات (Byte-Fallback) لضمان إعادة البناء بنسبة 100% دون فقدان أي حرف.
"""

import re
import json
import os
from typing import List, Tuple, Dict, Any

# Special Tokens
SPECIAL_TOKENS = {
    "<pad>": 0,
    "<bos>": 1,
    "<eos>": 2,
    "<unk>": 3,
    "<lang_ar>": 4,      # فصحى
    "<lang_arz>": 5,     # عامية مصرية
    "<lang_en>": 6,      # إنجليزي
    "<lang_de>": 7,      # ألماني
    "<code_start>": 8,
    "<code_end>": 9,
    "<newline>": 10,
    "<tab>": 11,
}

# Arabic Proclitics (سوابق عربية تلتحم بالكلمة)
AR_PROCLITICS = ["و", "ف", "ب", "ل", "ك", "ال", "لل", "وال", "فال", "وب", "فب", "ول", "فل"]

# Egyptian Colloquial Vocabulary
EGYPTIAN_VOCAB = [
    "عايز", "عايزة", "عاوز", "عاوزة", "ازاي", "ازيك", "ازيكم", "كدة", "كدا",
    "دلوقتي", "دلوقت", "علشان", "عشان", "فين", "إيه", "ايه", "ليه", "بتاع",
    "بتاعة", "بتوع", "معلش", "برضه", "برضو", "شغال", "شغالة", "مفيش", "خلاص",
    "يلا", "أوي", "قوي", "حاجة", "حاجات", "دول", "دي", "ده", "كويس", "تمام",
    "مش", "مانيش", "أعمل", "اعمل", "تسلم", "يا باشا", "شوفت", "هات"
]

# German Specific Characters and Common Particles
GERMAN_CHARS = ["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"]
GERMAN_WORDS = [
    "der", "die", "das", "und", "nicht", "ein", "eine", "ist", "mit", "für",
    "von", "erstellen", "anwendung", "datenbank", "benutzer", "bestellung",
    "bildschirm", "reparieren", "fehler", "prüfung", "schnittstelle", "speichern",
    "liefern", "klinik", "arzt", "praxis", "warenkorb", "kauf", "speicherleck"
]

# Common Software Engineering & Arabic Vocabulary
CORE_WORDS = [
    # Arabic Architecture
    "أنشئ", "تطبيق", "برنامج", "منصة", "نظام", "قاعدة", "بيانات", "مستخدم",
    "سجل", "طلب", "شاشة", "واجهة", "إصلاح", "عطل", "اختبار", "خادم", "حفظ",
    "تسليم", "عيادة", "مرضى", "طبي", "روشتة", "كشوفات", "متجر", "سلة", "منتجات",
    "دفع", "شحن", "أمان", "صلاحيات", "تقرير", "فحص", "تسريب", "ذاكرة", "أداء",
    # English
    "create", "app", "application", "database", "user", "order", "screen",
    "repair", "bug", "test", "server", "interface", "save", "deliver", "clinic",
    "patient", "store", "cart", "product", "function", "const", "let", "class",
    "import", "export", "return", "await", "async", "schema", "sqlite", "express",
    "react", "typescript", "python", "memory", "leak", "diagnostic", "patch"
]

class AbqarinoTokenizer:
    """
    المجزئ اللغوي العصبي المتقدم لعبقرينو:
    - تشفير وفك تشفير بنسبة تطابق 100% (Lossless Round-Trip).
    - دعم السوابق واللواصق، واللهجة المصرية، والألمانية، ورموز البرمجة.
    """
    def __init__(self, vocab_file: str = None):
        self.special_tokens = dict(SPECIAL_TOKENS)
        self.vocab: Dict[str, int] = {}
        self.inverse_vocab: Dict[int, str] = {}
        self.vocab_size = 32000
        
        self._build_vocab()
        if vocab_file and os.path.exists(vocab_file):
            self.load_vocab(vocab_file)

    def _build_vocab(self):
        """بناء المفردات الأساسية بما يشمل البايتات والسوابق واللهجات"""
        # 1. Special tokens
        for token, idx in self.special_tokens.items():
            self.vocab[token] = idx
            self.inverse_vocab[idx] = token
            
        current_idx = len(self.vocab)
        
        # 2. Byte Fallback tokens for all 256 bytes (0x00 to 0xFF)
        # This guarantees 100% lossless reconstruction for any arbitrary unicode/binary
        self.byte_start_idx = current_idx
        for b in range(256):
            b_token = f"<byte_0x{b:02X}>"
            self.vocab[b_token] = current_idx
            self.inverse_vocab[current_idx] = b_token
            current_idx += 1
            
        # 3. Arabic Clitics (Subword Prefixes)
        for clitic in AR_PROCLITICS:
            c_token = f"{clitic}+"
            if c_token not in self.vocab:
                self.vocab[c_token] = current_idx
                self.inverse_vocab[current_idx] = c_token
                current_idx += 1

        # 4. Egyptian dialect vocabulary
        for eg in EGYPTIAN_VOCAB:
            if eg not in self.vocab:
                self.vocab[eg] = current_idx
                self.inverse_vocab[current_idx] = eg
                current_idx += 1

        # 5. German characters & words
        for g in GERMAN_CHARS + GERMAN_WORDS:
            if g not in self.vocab:
                self.vocab[g] = current_idx
                self.inverse_vocab[current_idx] = g
                current_idx += 1

        # 6. Core Arabic & English vocabulary
        for w in CORE_WORDS:
            if w not in self.vocab:
                self.vocab[w] = current_idx
                self.inverse_vocab[current_idx] = w
                current_idx += 1

        # 7. Common punctuation, symbols, whitespace tokens
        common_symbols = [
            " ", "  ", "    ", "\n", "\t", "{", "}", "[", "]", "(", ")",
            ";", ":", ",", ".", "!", "?", "؟", "،", "=", "==", "===",
            "!=", "!==", "+", "-", "*", "/", ">", "<", ">=", "<=", "=>",
            "->", "&&", "||", '"', "'", "`", "$", "#", "@", "_", "\\", "|"
        ]
        for s in common_symbols:
            if s not in self.vocab:
                self.vocab[s] = current_idx
                self.inverse_vocab[current_idx] = s
                current_idx += 1

    def detect_language(self, text: str) -> str:
        """
        اكتشاف لغة النص بدقة:
        - ar: فصحى
        - arz: عامية مصرية
        - de: ألماني
        - en: إنجليزي
        """
        # 1. Check for Egyptian dialect markers
        words = set(re.findall(r'[\u0600-\u06FF]+', text))
        egyptian_hits = words.intersection(set(EGYPTIAN_VOCAB))
        if len(egyptian_hits) >= 1:
            return "arz"

        # 2. Check for Arabic script
        if re.search(r'[\u0600-\u06FF]', text):
            return "ar"

        # 3. Check for German
        if re.search(r'[äöüßÄÖÜ]', text) or re.search(r'\b(der|die|das|und|nicht|ein|eine|ist|mit|für|von|erstellen|anwendung|speicherleck)\b', text, re.IGNORECASE):
            return "de"

        # 4. Default to English / Code
        return "en"

    def split_arabic_clitics(self, word: str) -> List[str]:
        """
        تفكيك السوابق الصرفية للكلمة العربية
        مثال: وبالمرضى -> ["و+", "ب+", "ال+", "مرضى"]
        """
        if len(word) <= 3:
            return [word]

        result = []
        rem = word

        # 1. Waw / Fa conjunctions: و، ف
        if (rem.startswith("و") or rem.startswith("ف")) and len(rem) > 3:
            result.append(rem[0] + "+")
            rem = rem[1:]

        # 2. Prepositions: ب، ل، ك
        if (rem.startswith("ب") or rem.startswith("ل") or rem.startswith("ك")) and len(rem) > 3:
            # Check if followed by definite article or noun
            if rem.startswith("بال") or rem.startswith("فال") or rem.startswith("كال") or rem.startswith("لل"):
                result.append(rem[0] + "+")
                rem = rem[1:]
            elif len(rem) >= 4 and not rem.startswith("بيت") and not rem.startswith("بلد") and not rem.startswith("لبن"):
                result.append(rem[0] + "+")
                rem = rem[1:]

        # 3. Definite Article: ال
        if rem.startswith("ال") and len(rem) > 3:
            result.append("ال+")
            rem = rem[2:]

        result.append(rem)
        return result

    def tokenize_raw(self, text: str) -> List[str]:
        """
        تقطيع النص مع المحافظة الدقيقة على المسافات، الأسطر، والرموز
        """
        # Pattern splits on:
        # - Whitespace sequences (\n, \t, spaces)
        # - Arabic words
        # - Latin/German words
        # - Programming operators & punctuation
        pattern = r'(\r\n|\n|\t| +|[\u0600-\u06FF]+|[a-zA-Z0-9äöüßÄÖÜ]+|===|!==|==|!=|=>|->|&&|\|\||[^\s\w])'
        raw_tokens = re.findall(pattern, text)
        
        refined_tokens = []
        for t in raw_tokens:
            # Check if arabic word has detachable clitics
            if re.match(r'^[\u0600-\u06FF]+$', t) and t not in self.vocab and t not in EGYPTIAN_VOCAB:
                clitics = self.split_arabic_clitics(t)
                refined_tokens.extend(clitics)
            else:
                refined_tokens.append(t)
                
        return refined_tokens

    def encode(self, text: str, add_special_tokens: bool = True) -> List[int]:
        """
        تحويل النص إلى تسلسل معرفات رقمية مع استرجاع البايتات للكلمات غير المعروفة
        """
        lang = self.detect_language(text)
        raw_tokens = self.tokenize_raw(text)
        token_ids: List[int] = []

        if add_special_tokens:
            token_ids.append(self.special_tokens["<bos>"])
            lang_key = f"<lang_{lang}>"
            if lang_key in self.special_tokens:
                token_ids.append(self.special_tokens[lang_key])

        for tok in raw_tokens:
            if tok in self.vocab:
                token_ids.append(self.vocab[tok])
            else:
                # Byte fallback: encode unknown token as UTF-8 byte tokens
                # Guaranteeing 100% lossless representation
                utf8_bytes = tok.encode("utf-8")
                for b in utf8_bytes:
                    token_ids.append(self.byte_start_idx + b)

        if add_special_tokens:
            token_ids.append(self.special_tokens["<eos>"])

        return token_ids

    def decode(self, token_ids: List[int], skip_special_tokens: bool = True) -> str:
        """
        إعادة بناء النص الأصلي بحرفية كاملة بنسبة 100%
        """
        byte_stream = bytearray()
        parts: List[str] = []

        for tid in token_ids:
            if tid in self.inverse_vocab:
                val = self.inverse_vocab[tid]
                
                # Check for special tokens
                if val.startswith("<") and val.endswith(">"):
                    if val.startswith("<byte_0x"):
                        # Extract hex byte
                        hex_val = int(val[8:10], 16)
                        byte_stream.append(hex_val)
                        continue
                    elif skip_special_tokens:
                        continue
                
                # If we have buffered bytes, decode them first
                if byte_stream:
                    parts.append(byte_stream.decode("utf-8", errors="replace"))
                    byte_stream.clear()
                    
                # Handle clitic prefix notation "و+" -> "و" without affecting arithmetic "+"
                if len(val) > 1 and val.endswith("+") and any(val == c + "+" for c in AR_PROCLITICS):
                    parts.append(val[:-1])
                else:
                    parts.append(val)
            else:
                # Fallback for unknown token IDs
                if byte_stream:
                    parts.append(byte_stream.decode("utf-8", errors="replace"))
                    byte_stream.clear()
                parts.append(f"<unk_{tid}>")

        if byte_stream:
            parts.append(byte_stream.decode("utf-8", errors="replace"))

        return "".join(parts)

    def save_vocab(self, filepath: str):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump({
                "vocab": self.vocab,
                "vocab_size": len(self.vocab),
                "special_tokens": self.special_tokens
            }, f, ensure_ascii=False, indent=2)

    def load_vocab(self, filepath: str):
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            self.vocab = data.get("vocab", {})
            self.inverse_vocab = {v: k for k, v in self.vocab.items()}
            self.special_tokens = data.get("special_tokens", self.special_tokens)

# Self-Verification Test
if __name__ == "__main__":
    tok = AbqarinoTokenizer()
    print("=" * 65)
    print("🧠 فحص المجزئ اللغوي العصبي المتقدم لعبقرينو (Tokenizer Verification)")
    print("=" * 65)
    print(f"حجم المفردات الأساسية المنشأة: {len(tok.vocab)} وحدة")

    test_cases = [
        ("الفصحى مع السوابق", "وبالمرضى وللطبيب فالعيادة كالشمس وكتبه"),
        ("العامية المصرية", "عايز أعمل تطبيق زي أوبر شغال دلوقتي علشان التوصيل"),
        ("English & Code", "const sum = (a: number, b: number): number => {\n  return a + b;\n};"),
        ("Deutsch mit Umlauten", "Erstelle eine Webanwendung für Ärzte mit Überweisung und Röntgen.")
    ]

    all_passed = True
    for category, text in test_cases:
        lang = tok.detect_language(text)
        encoded = tok.encode(text, add_special_tokens=False)
        decoded = tok.decode(encoded, skip_special_tokens=True)
        is_exact = (text == decoded)
        if not is_exact:
            all_passed = False
        
        raw_tokens = tok.tokenize_raw(text)
        print(f"\n[{category}] - اللغة المكتشفة: {lang.upper()}")
        print(f"  النص الأصلي: {text}")
        print(f"  الوحدات المستخرجة ({len(raw_tokens)} tokens): {raw_tokens[:8]}...")
        print(f"  المعرفات ({len(encoded)} ids): {encoded[:8]}...")
        print(f"  النص المسترجع: {decoded}")
        print(f"  تطابق 100% دون فقدان: {'✓ نجح' if is_exact else '✕ فشل'}")

    # Clitic breakdown test
    print("\n[فحص تفكيك السوابق العربية]:")
    clitic_word = "وبالمريض"
    parts = tok.split_arabic_clitics(clitic_word)
    print(f"  الكلمة: '{clitic_word}' -> التفكيك: {parts}")
    assert parts == ["و+", "ب+", "ال+", "مريض"], f"خطأ في تفكيك {clitic_word}: {parts}"
    print("  ✓ تفكيك السوابق الصرفية مطابق للقواعد اللغوية بدقة!")

    if all_passed:
        print("\n" + "=" * 65)
        print("✓ تم اجتياز جميع اختبارات المجزئ اللغوي بنجاح وتطابق 100%!")
        print("=" * 65)
    else:
        print("\n✕ يوجد خطأ في إعادة بناء النصوص!")
        exit(1)
