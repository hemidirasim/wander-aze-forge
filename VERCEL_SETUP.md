# Vercel Deployment Setup

## Environment Variables

Vercel dashboard'da aşağıdaki environment variables'ları ekleyin:

### Database
```
DATABASE_URL=postgresql://neondb_owner:npg_cuU7z3plExsy@ep-winter-shadow-ad30554v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Admin Panel
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
SESSION_SECRET=your-secret-key-here-12345
```

### Vercel Blob Storage
```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_E4sM2P9CqIcdXJYG_vPxKKu1Kjc6i8fjYfN36epuHFWcXij
```

## Admin Panel URLs

After deployment, admin panel will be available at:

- **Admin Login**: `https://your-domain.vercel.app/admin/login`
- **Admin Dashboard**: `https://your-domain.vercel.app/admin/dashboard`
- **Admin Test**: `https://your-domain.vercel.app/admin/test`

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123

## Deployment Steps

1. **Set Environment Variables** in Vercel Dashboard
2. **Deploy** the project
3. **Access Admin Panel** at `/admin/login`
4. **Test API Connection** at `/admin/test`

## Troubleshooting

### Admin Panel Not Loading
1. Check if environment variables are set correctly
2. Verify database connection
3. Check Vercel function logs
4. Test API endpoints at `/admin/test`

### Database Connection Issues
1. Verify DATABASE_URL is correct
2. Check if database is accessible
3. Run database initialization scripts

### API Endpoints Not Working
1. Check Vercel function logs
2. Verify API routes are correctly configured
3. Test with `/admin/test` page

## File Structure for Vercel

```
├── api/
│   └── admin/
│       ├── login.ts
│       └── logout.ts
├── src/
│   ├── pages/
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminTours.tsx
│   │   └── AdminTest.tsx
│   └── services/
│       └── adminService.ts
├── vercel.json
└── package.json
```

## Testing

After deployment, test the following:

1. **Homepage**: `https://your-domain.vercel.app/`
2. **Admin Login**: `https://your-domain.vercel.app/admin/login`
3. **Admin Test**: `https://your-domain.vercel.app/admin/test`
4. **API Health**: `https://your-domain.vercel.app/api/health`

If admin panel doesn't work, check the `/admin/test` page for detailed error information.
