# ✅ AngularApp2 Test Plan

## 1. Add Reservation Tests
- ✅ Add a reservation with valid inputs (location, times, optional image).  
  _**Status:** Done — Working_
- ✅ Add a reservation with missing required fields. 
  _**Status:** Done — Submit is disabled_
- ✅ Add a reservation with only required fields (no image or reserved checkbox).  
  _**Status:** Done — Working_
- ✅ Add a reservation and confirm it’s visible in the list immediately.  
  _**Status:** Done — Working_

---

## 2. Edit Reservation Tests
- ✅ Click “Edit” and confirm fields are pre-filled with current data.  
  _**Status:** Done — Working_
- ✅ Update location, times, or reserved status and save — confirm list updates. 
  _**Status:** Done — Working_
- ✅ Change the image and verify that the new image is saved and displayed.  
  _**Status:** Done — Working_
- ✅ Change the image and verify that the old image is deleted.  
  _**Status:** Done — Working_
- ✅ Cancel edit and confirm you are returned to the list without changes. 
  _**Status:** Done — Working_

---

## 4. Form Validation Tests
- ✅ Submit the Add form without entering a location — verify required field message. 
  _**Status:** Done — Working_
- ✅ Submit the form with only start time or end time — verify appropriate error.  
  _**Status:** Done — Working_
- ✅ Ensure the “Add Reservation” button is disabled when the form is invalid.  
  _**Status:** Done — Working_

---

## 5. File Upload Tests
- ✅ Upload a supported image (e.g., .jpg, .png) — confirm it shows up correctly.  
  _**Status:** Done — Working_
- ✅ Try to upload a non-image file (e.g., .txt) — confirm it is rejected or not shown.  
  _**Status:** Done — Now prevents invalid file types_  
  _**Behavior:** Displays a warning if a non-image file is selected. If the user continues to submit:_
  - _For new reservations: `placeholder.jpg` is used instead._
  - _For edits: the original image is kept._
- ✅ Add a reservation without uploading an image — confirm placeholder is used.  
  _**Status:** Done — Working_

---

## 6. Navigation Tests
- ✅ Click “Add Contact” button — verify routing to add screen.  
  _**Status:** Done — Working_
- ✅ Click “Edit” button — verify routing to edit screen.  
  _**Status:** Done — Works_
- ✅ Click “About Us” button — verify routing to about screen.  
  _**Status:** Done — Working_
- ✅ On add/edit screens, test “Cancel” button returns to reservation list. 
  _**Status:** Done — Working_

---

## 7. Duplicate Entry Tests

- ✅ **Attempt to add a reservation with the same location, start time, and end time as an existing one**  
  _**Status:** Duplicate is now correctly **rejected**_  
  _**Action:** ✅ Implemented_
- ✅ **Try submitting a reservation where only the image or “reserved” status differs from an existing entry**  
  _**Status:** Treated as duplicate and rejected_  
  _**Action:** ✅ Implemented_
- ✅ **Edit an existing reservation to match another reservation’s time/location**  
  _**Status:** Prevents overlap by rejecting the change_  
  _**Action:** ✅ Implemented_
- ✅ **Confirm the app shows an error message or alert if duplicate prevention is in place**  
  _**Status:** Duplicate attempts trigger a visible error message in the app UI_  
  _**Action:** ✅ Implemented_