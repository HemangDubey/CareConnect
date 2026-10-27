# Donation Feature - Implementation Guide

## Overview
This feature enables home admins to register homes with UPI payment information and allows donors to easily donate via QR code scanning or UPI app.

## Environment Variables

Add to your `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
```

## File Structure

```
models/
  └── Home.js                    # Updated with UPI fields

app/
  ├── api/
  │   └── homes/
  │       ├── route.js                    # POST /api/homes (create home with UPI)
  │       └── [id]/
  │           └── route.js                 # GET /api/homes/[id] (get home), PATCH (update QR)
  ├── register-home/
  │   └── page.js                        # Admin form with UPI fields and QR upload
  ├── homes/
  │   └── [id]/
  │       └── page.js                    # Home page with Donate button
  └── components/
      └── DonateModal.jsx                # Donation modal component
```

## Setup Instructions

1. **Install Dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### 1. Create Home with UPI
- **POST** `/api/homes`
- **Auth**: Admin required (add middleware)
- **Body**:
  ```json
  {
    "name": "Home Name",
    "contactEmail": "contact@example.com",
    "contact": "+91 1234567890",
    "location": "Address",
    "description": "Description",
    "upi": {
      "vpa": "home@paytm"
    }
  }
  ```

### 2. Get Home
- **GET** `/api/homes/[id]`
- **Auth**: Public
- **Returns**: Home object with UPI fields (including QR image as base64)

### 3. Update Home QR Image
- **PATCH** `/api/homes/[id]`
- **Auth**: Admin required
- **Body**:
  ```json
  {
    "upi": {
      "qrImageUrl": "data:image/png;base64,..."
    }
  }
  ```

## QR Image Storage

QR images are stored as base64 data URLs directly in the MongoDB `Home` document:
- When a QR image is uploaded in `/register-home`, it's converted to base64
- The base64 string is stored in `home.upi.qrImageUrl`
- The image is displayed directly from the database (no separate file serving needed)
- Simple and straightforward - treats QR like a normal image

## Testing Checklist

### 1. Register Home with UPI
- [ ] Navigate to `/register-home`
- [ ] Fill in all required fields including UPI VPA (required)
- [ ] Optionally upload QR image (PNG/JPG/SVG, max 2MB)
- [ ] Submit form
- [ ] Verify success message appears
- [ ] Verify QR image and UPI ID are displayed after submission
- [ ] Check database for created home with UPI fields

### 2. Verify QR Image Storage
- [ ] Create a home with QR image via `/register-home`
- [ ] Verify QR image is stored as base64 in database
- [ ] Check that `home.upi.qrImageUrl` contains base64 data URL

### 3. View Home Page
- [ ] Navigate to `/homes/[id]` where `id` is the home ID
- [ ] Verify "Donate" button is visible in sidebar
- [ ] Click "Donate" button
- [ ] Verify donation modal opens

### 4. Test Donation Modal
- [ ] Verify QR code image displays (if uploaded) - large and scan-friendly
- [ ] Verify UPI ID is displayed
- [ ] Test "Copy" button for UPI ID
- [ ] Enter amount in input field
- [ ] Click "Open UPI App" button
- [ ] Verify UPI app opens (on mobile) or URL is generated correctly
- [ ] Test fallback instructions if QR is missing

### 5. Mobile Testing
- [ ] Test on mobile device
- [ ] Scan QR code with UPI app
- [ ] Verify amount is pre-filled correctly
- [ ] Test "Open UPI App" button functionality

## Security Notes

- **Admin Authentication**: Add authentication middleware to admin routes (`/api/homes` POST, `/api/homes/[id]/upload-qr`)
- **File Validation**: File type and size validation is implemented (PNG/JPG/SVG, max 2MB)
- **No Sensitive Data**: Do NOT store PIN/CVV or any sensitive payment data
- **UPI Validation**: UPI VPA format validation is implemented
- **Path Traversal Protection**: Filename validation prevents directory traversal attacks

## Troubleshooting

1. **QR Image Not Loading**:
   - Check that `home.upi.qrImageUrl` contains valid base64 data URL
   - Verify base64 string starts with `data:image/...`
   - Check browser console for errors
   - Ensure image was properly converted to base64 during upload

2. **UPI App Not Opening**:
   - Test on mobile device (desktop browsers may not support `upi://` protocol)
   - Verify UPI VPA format is correct
   - Check browser console for errors

3. **QR Image Upload Fails**:
   - Check file size (must be < 2MB)
   - Verify file type (PNG, JPG, or SVG)
   - Check browser console for errors
   - Verify base64 conversion is working

4. **"UPI information not available" Error**:
   - Verify home has UPI VPA set in database
   - Check `/api/homes/[id]` endpoint returns home data
   - Verify home ID is correct
   - Ensure `home.upi.vpa` exists in the database

## Next Steps

1. Add authentication middleware to admin routes
2. Add QR code generation if not uploaded
3. Add donation tracking/analytics
4. Add email notifications on donations
5. Implement donation history for users

