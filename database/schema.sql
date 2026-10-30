-- ===================================================
-- مخطط قاعدة البيانات الكامل لمنصة عبقرينو Studio Ultimate
-- الباب الثالث عشر: قاعدة البيانات والبنية الخلفية
-- متوافق مع SQLite 3 و PostgreSQL 15+
-- ===================================================

-- 1. جدول المستخدمين والصلاحيات
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'client', 'engineer')),
    password_hash TEXT NOT NULL,
    phone_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- 2. جدول المشروعات
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_email TEXT,
    project_type TEXT NOT NULL CHECK(project_type IN ('creation', 'repair')),
    tech_stack TEXT NOT NULL, -- JSON Array
    status TEXT NOT NULL,
    current_stage INTEGER DEFAULT 1,
    price_egp REAL NOT NULL,
    payment_verified_by_owner INTEGER DEFAULT 0 CHECK(payment_verified_by_owner IN (0, 1)),
    payment_reference_phone TEXT DEFAULT '01153747612',
    secure_storage_path TEXT,
    final_bundle_size_bytes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    delivered_at DATETIME
);

-- 3. جدول متطلبات المشروع
CREATE TABLE IF NOT EXISTS project_requirements (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK(category IN ('core', 'database', 'security', 'ui', 'integration')),
    is_approved INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 4. جدول شاشات واجهة المستخدم
CREATE TABLE IF NOT EXISTS project_screens (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    name TEXT NOT NULL,
    route TEXT NOT NULL,
    description TEXT,
    components TEXT, -- JSON Array
    responsive_breakpoints TEXT, -- JSON Array: mobile, tablet, desktop
    inputs TEXT, -- JSON Array
    actions TEXT, -- JSON Array
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 5. جدول ملفات المشروع
CREATE TABLE IF NOT EXISTS project_files (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    file_path TEXT NOT NULL,
    language TEXT NOT NULL,
    content TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 6. جدول الاختبارات وضمان الجودة
CREATE TABLE IF NOT EXISTS project_tests (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    test_name TEXT NOT NULL,
    test_type TEXT NOT NULL CHECK(test_type IN ('syntax', 'unit', 'integration', 'security', 'database', 'performance')),
    status TEXT NOT NULL CHECK(status IN ('passed', 'failed', 'pending')),
    execution_time_ms INTEGER DEFAULT 0,
    output_log TEXT,
    executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 7. جدول سجل التدقيق الإداري (Audit Log)
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    action TEXT NOT NULL,
    actor TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. جدول سجل التسليم الخارجي (الباب العاشر)
CREATE TABLE IF NOT EXISTS delivery_logs (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    admin_id TEXT NOT NULL,
    channel TEXT NOT NULL DEFAULT 'whatsapp',
    recipient_contact TEXT NOT NULL,
    payment_confirmed_via TEXT NOT NULL DEFAULT '01153747612',
    delivery_notes TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- فهارس لتحسين سرعة الاستعلام
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_order_num ON projects(order_number);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
