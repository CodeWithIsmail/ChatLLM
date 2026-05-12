# Authentication Troubleshooting Guide

## Common Issues and Solutions

### 🔐 Login Issues

**Problem: "Invalid email or password" error**
- Solution: Double-check your email and password
- Make sure you're using the email you registered with
- Passwords are case-sensitive

**Problem: "Session expired" message**
- Solution: JWT tokens expire after 7 days for security
- Simply login again to get a new token
- Your chat history will still be there

**Problem: Can't access `/auth` page**
- Solution: Make sure the development server is running
- Check the URL: `http://localhost:3000/auth`
- Clear browser cache if needed

### 💾 Chat History Issues

**Problem: Chats disappeared after login**
- Explanation: Anonymous chats are stored locally, authenticated chats in database
- Solution: This is expected behavior - start new chats after login
- Future: We plan to add migration from local to authenticated storage

**Problem: Old chats not showing**
- Solution: Make sure you're logged into the correct account
- Check if you have multiple accounts
- Verify you're using the same browser/device where chats were created

**Problem: Chats not saving**
- Check browser console for API errors
- Verify database connection (should see `dev.db` file in project root)
- Make sure you're logged in (check sidebar for user info)

### 🔧 Technical Issues

**Problem: Database errors**
- Solution: Run database commands again:
  ```bash
  npx prisma generate
  npx prisma db push
  ```

**Problem: "JWT_SECRET not found" error**
- Solution: Make sure `.env` file has:
  ```
  JWT_SECRET="your-super-secret-jwt-key"
  ```

**Problem: CORS errors with authentication**
- Solution: Make sure OLLAMA_ORIGINS includes your frontend URL
- For local development: usually not needed
- For production: set OLLAMA_ORIGINS environment variable

### 🚀 Getting Started Tips

1. **First Time Users:**
   - Try guest mode first to get familiar
   - Register when you want to save chats permanently
   - Use a real email for future account recovery features

2. **Switching Between Modes:**
   - You can use both guest and authenticated modes
   - Guest chats stay in browser storage
   - Authenticated chats sync across devices

3. **Account Management:**
   - Click your avatar in sidebar for options
   - Username shown in sidebar when logged in
   - Logout clears local session but keeps server data

### 📧 Need Help?

If you're still having issues:
1. Check browser console for error messages
2. Verify all environment variables are set
3. Make sure Ollama is running on correct port
4. Try clearing browser storage/cache
5. Restart the development server

Remember: The authentication system is optional - you can always use guest mode!
