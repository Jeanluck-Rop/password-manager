# Password Manager – Development Guide

This guide explains how to **clone, run, and build** the project from source.

After cloning the repository, go to:

```
cd password-manager/app_pm
```

## **Requirements**
This directory contains the Tauri application.
Make sure you have the following installed:

1. Rust (stable)
2. Cargo (comes with Rust)
3. Node.js (LTS recommended)
4. Tauri CLI
```
cargo install tauri-cli
```
5. npm
```
npm install -g npm
```

### **Windows Additional Requirements**

Because this project uses SQLCipher and OpenSSL, Windows requires extra tools:

1. Perl (Strawberry Perl recommended)

2. OpenSSL

3. Node.js (must be properly added to PATH)

4. Microsoft C++ Build Tools

**OpenSSL is configured with:**

openssl = { version = "0.10", features = ["vendored"] }

So Cargo will build it automatically, but system dependencies are still required on Windows.


### **Linux Notes**
On Linux, most dependencies are handled automatically.
If OpenSSL headers are missing, install:

#### Debian / Ubuntu
```
sudo apt install libssl-dev pkg-config
```

#### Fedora
```
sudo dnf install openssl-devel pkg-config
```

## **Run in Development Mode**

From password-manager/app_pm:
```
npm install
npm run tauri dev
```

This launches the app in development mode.

## **Build the Application**

To generate a production build:
```
npm run tauri build
```

The compiled binaries will be generated in `src-tauri/target/release/bundle/` for **Linux** and `src-tauri/target/release/`fron **Windows**.


## **Notes**
Android builds are currently disabled due to SQLCipher compatibility issues.
