-- Public raw-delivery URLs exposed resume PII. Application access now checks
-- ownership then redirects to a five-minute signed URL for authenticated media.
ALTER TABLE "resumes" DROP COLUMN "file_url";
