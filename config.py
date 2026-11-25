"""Konfigurasi muse2api."""
from __future__ import annotations

import os
import shutil
from dataclasses import dataclass, field

_DEFAULT_BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def _load_dotenv():
    """Memuat file .env di direktori root proyek secara otomatis (tidak menimpa variabel environment sistem yang sudah ada)."""
    base = os.environ.get("MUSE2API_HOME") or _DEFAULT_BASE_DIR
    env_path = os.path.join(base, ".env")
    if not os.path.isfile(env_path):
        return
    try:
        with open(env_path, encoding="utf-8") as f:
            for line in f:
                s = line.strip()
                if not s or s.startswith("#") or "=" not in s:
                    continue
                k, v = s.split("=", 1)
                k = k.strip()
                v = v.strip().strip("'\"")
                if k and k not in os.environ:
                    os.environ[k] = v
    except OSError:
        pass


_load_dotenv()


def _env(key: str, default: str) -> str:
    return os.environ.get(key, default)


def _detect_chromium() -> str:
    """Utamakan MUSE2API_CHROMIUM; jika tidak diatur atau path tidak ada, deteksi otomatis Chromium/Chrome yang terinstal di sistem."""
    configured = os.environ.get("MUSE2API_CHROMIUM", "").strip()
    if configured and (os.path.isfile(configured) or shutil.which(configured)):
        return configured
    candidates = [
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser",
        "/snap/bin/chromium",
        "/usr/bin/google-chrome",
        "/usr/bin/google-chrome-stable",
        "chromium",
        "chromium-browser",
        "google-chrome",
        "chrome",
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    ]
    for c in candidates:
        if os.path.isfile(c) or shutil.which(c):
            return c
    return configured or "chromium"


@dataclass
class Config:
    base_dir: str = field(default_factory=lambda: _env("MUSE2API_HOME", _DEFAULT_BASE_DIR))
    host: str = field(default_factory=lambda: _env("MUSE2API_HOST", "0.0.0.0"))
    port: int = field(default_factory=lambda: int(_env("MUSE2API_PORT", "18610")))

    # Browser
    chromium: str = field(default_factory=_detect_chromium)
    cdp_port: int = field(default_factory=lambda: int(_env("MUSE2API_CDP_PORT", "19210")))
    home_dir: str = field(default_factory=lambda: _env("MUSE2API_HOME_DIR", os.path.expanduser("~")))
    extra_path: str = field(default_factory=lambda: _env("MUSE2API_EXTRA_PATH", "/snap/bin"))
    site_url: str = field(default_factory=lambda: _env("MUSE2API_SITE", "https://muse.ai/"))
    login_wait: int = field(default_factory=lambda: int(_env("MUSE2API_LOGIN_WAIT", "60")))

    # Direktori root profile browser.
    # Jebakan yang pernah dialami: Chromium versi snap dibatasi AppArmor, hanya bisa membaca/menulis path di bawah $HOME.
    # Melewatkan --user-data-dir=/opt/... atau /tmp/... tidak akan error, tetapi akan diabaikan secara diam-diam,
    # browser kembali ke ~/snap/chromium/common/chromium.
    # Jadi harus berada di bawah $HOME (jangan memakai direktori tersembunyi berawalan titik, karena interface home snap mengecualikan file tersembunyi).
    profile_root: str = field(
        default_factory=lambda: _env("MUSE2API_PROFILE_ROOT",
                                     os.path.join(os.path.expanduser("~"),
                                                  "muse2api-profiles")))

    # Autentikasi
    api_key: str = field(default_factory=lambda: _env("MUSE2API_KEY", ""))

    # Alamat publik (dipakai halaman admin untuk menampilkan "Alamat Akses"; dikosongkan berarti halaman memakai domain saat ini sebagai fallback)
    public_base: str = field(
        default_factory=lambda: _env("MUSE2API_PUBLIC_BASE", ""))

    # Asal yang diizinkan untuk memanggil interface impor lintas domain (dipakai saat skrip asisten Cookie mengirim dari halaman muse.ai)
    cors_origins: str = field(
        default_factory=lambda: _env("MUSE2API_CORS_ORIGINS",
                                     "https://muse.ai,https://www.muse.ai"))

    # Generasi
    image_timeout: int = field(default_factory=lambda: int(_env("MUSE2API_IMAGE_TIMEOUT", "240")))
    video_timeout: int = field(default_factory=lambda: int(_env("MUSE2API_VIDEO_TIMEOUT", "600")))
    chat_timeout: int = field(default_factory=lambda: int(_env("MUSE2API_CHAT_TIMEOUT", "300")))
    max_concurrency: int = field(default_factory=lambda: max(1, int(_env("MUSE2API_CONCURRENCY", "8"))))

    # Input gambar referensi secara default hanya mengizinkan pemanggil menyediakan data secara langsung dan URL publik.
    # Hanya deployment satu pengguna tepercaya yang boleh mengatur 1 secara eksplisit untuk memulihkan file lokal server atau pengambilan privat.
    ref_image_local_files: bool = field(
        default_factory=lambda: _env("MUSE2API_REF_IMAGE_LOCAL_FILES", "0").strip() == "1")
    ref_image_private_fetch: bool = field(
        default_factory=lambda: _env("MUSE2API_REF_IMAGE_PRIVATE_FETCH", "0").strip() == "1")

    # Sakelar adaptasi protokol pemanggilan tool (function calling), **default mati**.
    # Hasil pengujian: asisten muse.ai secara eksplisit menolak mengeluarkan "pemanggilan tool semu" (kutipan asli: "Saya tidak akan mengeluarkan 'pemanggilan tool semu' dalam format JSON seperti ini"), memaksakan injeksi protokol justru akan mengotori jawaban normal.
    # Jadi secara default hanya "kompatibilitas parameter" (klien mengirim tools tidak akan 422), tanpa injeksi dan tanpa parsing.
    # Jika perilaku model target berubah, atur MUSE2API_TOOL_PROTOCOL=1 untuk mengaktifkan lapisan adaptasi ini lalu coba lagi.
    tool_protocol: bool = field(
        default_factory=lambda: _env("MUSE2API_TOOL_PROTOCOL", "0").strip() != "0")

    # Pengaturan keep-alive: apakah akun yang sudah dinonaktifkan tetap dijalankan keep-alive otomatis, **default mati**.
    # Jika dinyalakan, akun yang dinonaktifkan manual oleh admin di latar belakang tetap dijalankan keep-alive otomatis dan wake-up VM oleh daemon latar belakang,
    # menjaga sesi tetap aktif dan tidak kedaluwarsa, tetapi tetap tidak ikut penjadwalan rotasi normal untuk pembuatan gambar, pembuatan video, dan percakapan.
    keepalive_disabled_accounts: bool = field(
        default_factory=lambda: _env("MUSE2API_KEEPALIVE_DISABLED_ACCOUNTS", "0").strip() != "0")

    @property
    def data_dir(self) -> str:
        return os.path.join(self.base_dir, "data")

    @property
    def media_dir(self) -> str:
        return os.path.join(self.data_dir, "media")

    @property
    def download_dir(self) -> str:
        return os.path.join(self.data_dir, "downloads")

    @property
    def profile_dir(self) -> str:
        """Profile browser untuk pembuatan."""
        return os.path.join(self.profile_root, "generate")

    @property
    def accounts_file(self) -> str:
        return os.path.join(self.data_dir, "accounts.json")

    @property
    def tasks_file(self) -> str:
        return os.path.join(self.data_dir, "tasks.json")

    def ensure_dirs(self):
        for d in (self.base_dir, self.data_dir, self.media_dir, self.download_dir,
                  self.profile_dir):
            os.makedirs(d, exist_ok=True)


CFG = Config()
