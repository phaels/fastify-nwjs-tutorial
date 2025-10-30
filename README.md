# 🚀 Fastify NW.js Desktop App Tutorial

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.x-brightgreen.svg)
![NW.js](https://img.shields.io/badge/NW.js-latest-orange.svg)
![Fastify](https://img.shields.io/badge/fastify-4.x-green.svg)
![Bootstrap](https://img.shields.io/badge/bootstrap-5.3-purple.svg)

**Eine vollständige plattformübergreifende Desktop-Anwendung mit Node.js, Fastify, EJS und Bootstrap**

[Features](#-features) • [Installation](#-installation) • [Verwendung](#-verwendung) • [Spenden](#-spenden) • [Lizenz](#-lizenz)

</div>

---

## 📋 Inhaltsverzeichnis

- [Features](#-features)
- [Voraussetzungen](#-voraussetzungen)
- [Installation](#-installation)
- [Projektstruktur](#-projektstruktur)
- [Entwicklung](#-entwicklung)
- [Build & Distribution](#-build--distribution)
- [Konfiguration](#-konfiguration)
- [API Dokumentation](#-api-dokumentation)
- [Troubleshooting](#-troubleshooting)
- [Spenden](#-spenden)
- [Contributing](#-contributing)
- [Lizenz](#-lizenz)

---

## ✨ Features

### 🖥️ **Plattformübergreifend**
Läuft nativ auf Windows, macOS und Linux

### ⚡ **Höchstleistung**
- **Fastify Server**: Bis zu 2x schneller als Express
- Optimiertes Routing und Request-Handling
- Asynchrone Middleware-Pipeline

### 🎨 **Modernes UI Design**
- **Bootstrap 5.3**: Responsives, mobil-optimiertes Design
- **Bootstrap Icons**: 1800+ hochwertige SVG-Icons
- **jQuery 3.7**: Vereinfachte DOM-Manipulation

### 📄 **Template Engine**
- **EJS**: Dynamische HTML-Seiten mit Partials
- Wiederverwendbare Komponenten
- Server-seitiges Rendering

### 🌐 **CDN-basiert**
Alle Frontend-Bibliotheken via CDN - keine lokalen Dependencies

### 📦 **Desktop Integration**
- Native Desktop-Anwendung mit NW.js
- Chromium + Node.js in einer App
- Zugriff auf Betriebssystem-APIs

### 🗜️ **Portable Builds**
Erstelle eigenständige Executables für alle Plattformen

---

## 🔧 Voraussetzungen

Bevor du startest, stelle sicher, dass du folgendes installiert hast:

- **Node.js** (Version 18.x oder höher) - [Download](https://nodejs.org/)
- **npm** (wird mit Node.js installiert)
- **Git** (optional) - [Download](https://git-scm.com/)

### Node.js Version prüfen

```bash
node --version
npm --version
```

---

## 🚀 Installation

### Schritt 1: Projekt erstellen

```bash
mkdir fastify-nwjs-tutorial
cd fastify-nwjs-tutorial
mkdir -p views/pages views/partials public
```

## 📁 Projektstruktur

```
fastify-nwjs-tutorial/
├── package.json
├── server.js
├── README.md
├── public/
├── views/
│   ├── pages/
│   │   ├── index.ejs
│   │   ├── about.ejs
│   │   └── 404.ejs
│   └── partials/
│       ├── head.ejs
│       ├── header.ejs
│       └── footer.ejs
└── build/
```

---

### Schritt 2: package.json erstellen

**package.json:**
```json
{
  "name": "bootstrap-nwjs-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "fastify": "^4.28.1",
    "point-of-view": "^6.0.0",
    "ejs": "^3.1.9",
    "@fastify/static": "^7.0.1",
    "serve-favicon": "^2.5.0",
    "jquery": "*",
    "bootstrap": "*",
    "bootstrap-icons": "*",
    "@popperjs/core": "*"
  },
  "description": "Bootstrap NW.js Desktop Anwendung mit Fastify",
  "node-main": "server.js",
  "main": "http://localhost:8080",
  "window": {
    "toolbar": true,
    "width": 1000,
    "height": 600,
    "resizable": true,
    "min_width": 800,
    "min_height": 600
  },
  "scripts": {
    "start": "nw .",
    "dev": "node server.js",
    "build:win": "nwbuild --mode=build --platforms win64 .",
    "build:mac": "nwbuild --mode=build --platforms osx64 .",
    "build:linux": "nwbuild --mode=build --platforms linux64 .",
    "build:all": "nwbuild --mode=build --platforms win64,osx64,linux64 ."
  },
  "author": "Martin Imle",
  "license": "MIT"
}
```

### Schritt 3: Dependencies installieren

```bash
npm install
```

### Schritt 4: Server erstellen

**server.js:**
```javascript
const fastify = require('fastify')({
  logger: process.env.NODE_ENV !== 'production' ? {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss'
      }
    }
  } : {
    level: 'info'
  }
});

const path = require('path');

// Graceful shutdown
const closeGracefully = async (signal) => {
  console.log(`\n🛑 Received signal to terminate: ${signal}`);
  await fastify.close();
  process.exit(0);
};

process.on('SIGINT', closeGracefully);
process.on('SIGTERM', closeGracefully);

// EJS Template Engine registrieren
fastify.register(require('point-of-view'), {
  engine: {
    ejs: require('ejs')
  },
  root: path.join(__dirname, 'views'),
  viewExt: 'ejs',
  defaultContext: {
    dev: process.env.NODE_ENV !== 'production'
  }
});

// Statische Dateien aus public/ bereitstellen
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/'
});

// Routen definieren
fastify.get('/', async (request, reply) => {
  return reply.view('pages/index', { 
    title: 'Home',
    active: 'home' 
  });
});

fastify.get('/about', async (request, reply) => {
  return reply.view('pages/about', { 
    title: 'Über',
    active: 'about' 
  });
});

// API Beispiel
fastify.get('/api/status', async (request, reply) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };
});

// 404 Handler
fastify.setNotFoundHandler((request, reply) => {
  reply.code(404).view('pages/404', { title: '404 - Nicht gefunden' });
});

// Error Handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  reply.code(500).send({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
  });
});

// Server starten
const start = async () => {
  try {
    const PORT = process.env.PORT || 8080;
    const HOST = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port: PORT, host: HOST });
    
    console.log('');
    console.log('🚀 Fastify Server erfolgreich gestartet!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📡 Server URL:     http://localhost:${PORT}`);
    console.log(`🌍 Network:        http://${HOST}:${PORT}`);
    console.log(`📊 Status:         Bereit für Verbindungen`);
    console.log(`⚡ Performance:    Ultra-schnell (Fastify)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 Drücke Strg+C zum Beenden');
    console.log('');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
```

### Schritt 5: Views erstellen

**views/partials/head.ejs:**
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Fastify NW.js Desktop App Tutorial">
<meta name="author" content="Dein Name">
<title><%= title || 'Fastify NW.js App' %> - Fastify Desktop App</title>

<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<!-- Bootstrap JS Bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Bootstrap Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">

<style>
  .card {
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  }
  
  .jumbotron {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .footer {
    background-color: #f8f9fa;
    border-top: 1px solid #dee2e6;
  }
</style>
```

**views/partials/header.ejs:**
```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
  <div class="container-fluid">
    <a class="navbar-brand fw-bold" href="/">
      <i class="bi bi-lightning-charge-fill text-warning"></i> 
      Fastify Desktop App
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link <%= active === 'home' ? 'active' : '' %>" href="/">
            <i class="bi bi-house-door"></i> Home
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link <%= active === 'about' ? 'active' : '' %>" href="/about">
            <i class="bi bi-info-circle"></i> Über
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/api/status" target="_blank">
            <i class="bi bi-activity"></i> API Status
          </a>
        </li>
      </ul>
      <div class="d-flex align-items-center">
        <span class="badge bg-success">
          <i class="bi bi-lightning-fill"></i> Fastify v4
        </span>
      </div>
    </div>
  </div>
</nav>
```

**views/partials/footer.ejs:**
```html
<footer class="footer mt-auto py-4 bg-light">
  <div class="container">
    <div class="row">
      <div class="col-md-6 text-center text-md-start">
        <span class="text-muted">
          © <%= new Date().getFullYear() %> Fastify NW.js Tutorial
        </span>
      </div>
      <div class="col-md-6 text-center text-md-end">
        <span class="text-muted">
          <i class="bi bi-lightning-fill text-warning"></i> Ultra-schnell
        </span>
      </div>
    </div>
  </div>
</footer>
```

**views/pages/index.ejs:**
```html
<!DOCTYPE html>
<html lang="de">
<head>
  <%- include('../partials/head'); %>
</head>
<body class="d-flex flex-column min-vh-100">
  
  <header>
    <%- include('../partials/header'); %>
  </header>
  
  <main class="container-fluid flex-grow-1 my-4">
    <!-- Hero Section -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="jumbotron p-5 rounded-3 shadow">
          <h1 class="display-3 fw-bold">
            <i class="bi bi-rocket-takeoff"></i> Willkommen!
          </h1>
          <p class="lead fs-4">
            Eine <strong>ultra-schnelle</strong> NW.js Desktop-Anwendung mit <strong>Fastify</strong> und EJS.
          </p>
          <hr class="my-4 border-light">
          <div class="alert alert-light border-0">
            <i class="bi bi-speedometer2 fs-4"></i> 
            <strong>Performance-Vorteil:</strong> Fastify ist bis zu 2x schneller als Express!
          </div>
          <a href="/about" class="btn btn-light btn-lg">
            <i class="bi bi-info-circle"></i> Mehr erfahren
          </a>
        </div>
      </div>
    </div>

    <!-- Feature Cards -->
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card h-100 text-center shadow-sm">
          <div class="card-body">
            <i class="bi bi-lightning-charge-fill display-1 text-warning"></i>
            <h5 class="card-title mt-3">Fastify Server</h5>
            <p class="card-text text-muted">
              Höchstleistungs-Webserver mit asynchroner Pipeline und optimiertem Routing
            </p>
            <div class="badge bg-success">Ultra-schnell</div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 text-center shadow-sm">
          <div class="card-body">
            <i class="bi bi-bootstrap-fill display-1 text-primary"></i>
            <h5 class="card-title mt-3">Bootstrap 5.3</h5>
            <p class="card-text text-muted">
              Modernes, responsives Design mit Utility-First CSS und flexiblem Grid-System
            </p>
            <div class="badge bg-primary">Responsive</div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 text-center shadow-sm">
          <div class="card-body">
            <i class="bi bi-window-desktop display-1 text-success"></i>
            <h5 class="card-title mt-3">NW.js Desktop</h5>
            <p class="card-text text-muted">
              Plattformübergreifende Desktop-App mit Chromium und Node.js Integration
            </p>
            <div class="badge bg-success">Cross-Platform</div>
          </div>
        </div>
      </div>
    </div>
  </main>
  
  <footer>
    <%- include('../partials/footer'); %>
  </footer>

  <script>
    $(document).ready(function() {
      // Add hover effects
      $(".card").hover(
        function() { $(this).addClass('shadow'); },
        function() { $(this).removeClass('shadow'); }
      );
    });
  </script>
</body>
</html>
```

**views/pages/about.ejs:**
```html
<!DOCTYPE html>
<html lang="de">
<head>
  <%- include('../partials/head'); %>
</head>
<body class="d-flex flex-column min-vh-100">
  
  <header>
    <%- include('../partials/header'); %>
  </header>
  
  <main class="container flex-grow-1 my-4">
    <div class="row">
      <div class="col-lg-8">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-primary text-white">
            <h2 class="mb-0">
              <i class="bi bi-info-circle-fill"></i> Über diese Anwendung
            </h2>
          </div>
          <div class="card-body">
            <h4 class="mb-3">Fastify NW.js Desktop App Tutorial</h4>
            <p class="lead">
              Eine <strong>ultra-schnelle</strong> plattformübergreifende Desktop-Anwendung mit modernen Web-Technologien.
            </p>
            
            <h5 class="mt-4 mb-3">
              <i class="bi bi-tools"></i> Technologie-Stack
            </h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  <strong>Node.js:</strong> JavaScript-Laufzeitumgebung
                </span>
                <span class="badge bg-success rounded-pill">v18+</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  <strong>Fastify:</strong> Höchstleistungs-Web-Framework
                </span>
                <span class="badge bg-primary rounded-pill">v4.28</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  <strong>EJS:</strong> Template-Engine für dynamisches HTML
                </span>
                <span class="badge bg-info rounded-pill">v3.1</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  <strong>Bootstrap:</strong> CSS-Framework für responsives Design
                </span>
                <span class="badge bg-purple rounded-pill">v5.3</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  <strong>NW.js:</strong> Desktop-App-Wrapper (Chromium + Node.js)
                </span>
                <span class="badge bg-danger rounded-pill">latest</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4">
        <!-- System Info -->
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-secondary text-white">
            <h5 class="mb-0">
              <i class="bi bi-laptop"></i> System-Info
            </h5>
          </div>
          <div class="card-body">
            <table class="table table-sm">
              <tbody>
                <tr>
                  <td><strong>Version:</strong></td>
                  <td>1.0.0</td>
                </tr>
                <tr>
                  <td><strong>Lizenz:</strong></td>
                  <td>MIT</td>
                </tr>
                <tr>
                  <td><strong>Server:</strong></td>
                  <td>Fastify</td>
                </tr>
                <tr>
                  <td><strong>Port:</strong></td>
                  <td>8080</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </main>
  
  <footer>
    <%- include('../partials/footer'); %>
  </footer>
</body>
</html>
```

**views/pages/404.ejs:**
```html
<!DOCTYPE html>
<html lang="de">
<head>
  <%- include('../partials/head'); %>
</head>
<body class="d-flex flex-column min-vh-100">
  
  <header>
    <%- include('../partials/header'); %>
  </header>
  
  <main class="container flex-grow-1 my-4 text-center">
    <div class="row">
      <div class="col-12">
        <i class="bi bi-exclamation-triangle display-1 text-warning"></i>
        <h1 class="display-1 fw-bold">404</h1>
        <h2>Seite nicht gefunden</h2>
        <p class="lead">Die angeforderte Seite existiert nicht.</p>
        <a href="/" class="btn btn-primary btn-lg mt-3">
          <i class="bi bi-house"></i> Zur Startseite
        </a>
      </div>
    </div>
  </main>
  
  <footer>
    <%- include('../partials/footer'); %>
  </footer>
</body>
</html>
```

---



## 💻 Entwicklung

### Development Server starten

```bash
npm run dev
```

Öffne dann deinen Browser unter: **http://localhost:8080**

### Als Desktop-App testen

```bash
npm install -g nw
npm start
```

---

## 📦 Build & Distribution

### Builds erstellen

```bash
# Windows Build
npm run build:win

# macOS Build  
npm run build:mac

# Linux Build
npm run build:linux

# Alle Plattformen
npm run build:all
```

---

## 💝 Spenden

Wenn dir dieses Tutorial geholfen hat und du meine Arbeit unterstützen möchtest, würde ich mich über eine Spende freuen:

**PayPal:** m.imle@gmx.net

[![PayPal Spenden](https://www.paypalobjects.com/de_DE/DE/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/donate/?hosted_button_id=DEINE_BUTTON_ID)

Jede Spende, egal wie klein, hilft mir, weitere Tutorials und Projekte zu erstellen. Vielen Dank für deine Unterstützung! ❤️

---

## 📄 Lizenz

MIT License

---

<div align="center">

**⭐ Wenn dir dieses Projekt gefällt, gib ihm einen Stern auf GitHub! ⭐**

Made with ❤️ and ⚡ Fastify

</div>
```
