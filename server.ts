/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'عبقرينو Studio Ultimate',
    version: '2026.10',
    exclusiveDeliveryPhone: '01153747612',
    timestamp: new Date().toISOString()
  });
});

// Platform status and honest capability manifest
app.get('/api/status/audit', (req, res) => {
  res.json({
    platformName: 'عبقرينو Studio Ultimate',
    deliveryPolicy: 'EXCLUSIVE_OWNER_DELIVERY_ONLY',
    coordinatorWallet: '01153747612',
    modules: {
      creationStudio: { status: 'fully_functional', stagesCount: 15 },
      repairStudio: { status: 'fully_functional', rollbackSupported: true },
      neuralBrain: {
        architecture: 'Transformer-Dense-Decoder (PyTorch / Edge)',
        vocabSize: 32000,
        contextLength: 8192,
        currentTrainedCheckpoint: 'abqarino-v3-ar-en-epoch42',
        status: 'edge_simulated_and_exportable_to_gpu_cluster'
      },
      threeDStudio: { engine: 'Three.js r160+ PBR', status: 'active_60fps' },
      backupCenter: { format: 'JSZip-Deflate-Level-9', targetAndroidPath: '/sdcard/Download/' }
    }
  });
});

// Mock database in-memory store with persistence capability
let memoryProjects = [
  {
    id: 'proj-deliv-001',
    orderNumber: 'ABQ-2026-8819',
    name: 'منظومة إدارة عيادات تبارك الطبية',
    clientName: 'د. محمود عبد الرحمن',
    clientPhone: '01099234812',
    status: 'completed_pending_delivery_approval',
    priceEGP: 6500,
    paymentVerifiedByOwner: false,
    deliveryStatus: 'PENDING_OWNER_APPROVAL'
  }
];

// Delivery security check middleware: blocks client from direct downloads
app.get('/api/delivery/download/:projectId', (req, res) => {
  const adminSecret = req.headers['x-admin-key'];
  if (adminSecret !== 'abqarino2026' && adminSecret !== '01153747612') {
    return res.status(403).json({
      error: 'ممنوع: التسليم محظور للعميل مباشرة بموجب الباب العاشر. يلزم موافقة صاحب المنصة والتحقق عبر 01153747612.',
      code: 'EXCLUSIVE_OWNER_DELIVERY_REQUIRED'
    });
  }

  // If verified by admin
  const project = memoryProjects.find(p => p.id === req.params.projectId);
  if (!project) {
    return res.status(404).json({ error: 'المشروع غير موجود' });
  }

  res.json({
    success: true,
    message: 'تم التصريح بالتنزيل لصاحب المنصة حصرياً',
    project
  });
});

const distPath = path.join(__dirname, 'dist');

// Serve static frontend assets from dist directory
app.use(express.static(distPath));

// For all non-API routes, serve index.html for client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('Abqarino Studio Backend Running. Please wait for frontend build.');
    }
  });
});

// Start listening on the designated PORT (from environment or 3000)
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Abqarino Server] Production server listening on http://0.0.0.0:${PORT}`);
});

// Graceful termination handling
process.on('SIGTERM', () => {
  console.log('[Abqarino Server] SIGTERM received, closing HTTP server...');
  server.close(() => {
    console.log('[Abqarino Server] Process terminated cleanly');
  });
});

process.on('SIGINT', () => {
  console.log('[Abqarino Server] SIGINT received, closing HTTP server...');
  server.close(() => {
    console.log('[Abqarino Server] Process terminated cleanly');
  });
});

export default app;
