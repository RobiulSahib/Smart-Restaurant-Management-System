# ☁️ How to Setup Free Image Hosting (Cloudinary)

To upload unlimited food photos for free, we use **Cloudinary**.

### Step 1: Create Account
1.  Go to [cloudinary.com](https://cloudinary.com/) and sign up for a **Free** account.

### Step 2: Get Cloud Name
1.  On your Dashboard, look for **"Cloud Name"**.
2.  Copy it (e.g., `dgh56...`).

### Step 3: Create Upload Preset
1.  Go to **Settings (Gear Icon)** -> **Upload**.
2.  Scroll down to **Upload presets**.
3.  Click **Add upload preset**.
4.  **Signing Mode**: Select **"Unsigned"** (Important!).
5.  **Name**: You can name it `restaurant_upload` or keep the default.
6.  Click **Save**.
7.  Copy the **Name** of the preset you just created.

### Step 4: Add to Project
1.  Open `frontend/.env` (create it if missing).
2.  Add these two lines:
    ```
    VITE_CLOUDINARY_CLOUD_NAME=paste_cloud_name_here
    VITE_CLOUDINARY_UPLOAD_PRESET=paste_preset_name_here
    ```
3.  Restart your frontend (`npm run dev`).

**Done!** Your app will now upload real images to the cloud. 📸
