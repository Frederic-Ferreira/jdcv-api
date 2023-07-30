-- AlterTable
CREATE SEQUENCE profile_id_profile_seq;
ALTER TABLE "Profile" ALTER COLUMN "id_profile" SET DEFAULT nextval('profile_id_profile_seq');
ALTER SEQUENCE profile_id_profile_seq OWNED BY "Profile"."id_profile";
