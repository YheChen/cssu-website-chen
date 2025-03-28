import { readFileSync } from "fs";
import path from "path";
import sizeOf from "image-size";
import Image from "next-image-export-optimizer";
import { getPlaiceholder } from "plaiceholder";
import { FaGithub, FaInstagram, FaLinkedin, FaUser } from "react-icons/fa";

function ProfileUrl({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      className="no-underline text-[black]"
      rel="noopener noreferrer"
    >
      <span className="h-[20px] px-[5px] py-0 [filter:opacity(0.7)] inline-block">
        {children}
      </span>
    </a>
  );
}

async function ProfileImage({
  imageUrl,
  fullName,
}: {
  imageUrl: string;
  fullName: string;
}) {
  // Use the imageUrl as-is for Next.js Image,
  // and assume the file is located in the public folder.
  const nextImagePath = imageUrl;
  const absoluteImagePath = path.join(process.cwd(), "public", imageUrl);
  const { width, height } = sizeOf(absoluteImagePath);
  const buffer = readFileSync(absoluteImagePath);
  const { base64 } = await getPlaiceholder(buffer);

  if (!width || !height) {
    console.error("\x1b[31m[Error]\x1b[0m %s", `Image ${imageUrl} not found`);
    throw new Error(`Image ${imageUrl} not found`);
  }

  return (
    <div className="min-w-full min-h-full rounded-[50%]">
      <Image
        src={nextImagePath}
        alt={fullName}
        className="rounded-[50%] border-none object-cover w-[148px] h-[148px]"
        blurDataURL={base64}
        placeholder="blur"
        height={148}
        width={148}
        priority
      />
    </div>
  );
}

type ProfileCardProps = {
  fullName: string;
  position?: string;
  imageUrl?: string;
  // Removed facebook prop.
  github?: string;
  instagram?: string;
  linkedin?: string;
  website?: string;
};

export default function ProfileCard({
  fullName,
  position,
  imageUrl,
  github,
  instagram,
  linkedin,
  website,
}: ProfileCardProps) {
  return (
    <div className="flex flex-wrap justify-center bg-[white]">
      <div className="bg-[white] w-[200px] h-[300px]">
        <center className="block px-0 py-[9px] h-[44px]">
          {github && (
            <ProfileUrl href={github}>
              <FaGithub className="text-[20px]" />
            </ProfileUrl>
          )}
          {instagram && (
            <ProfileUrl href={instagram}>
              <FaInstagram className="text-[20px]" />
            </ProfileUrl>
          )}
          {linkedin && (
            <ProfileUrl href={linkedin}>
              <FaLinkedin className="text-[20px]" />
            </ProfileUrl>
          )}
          {website && (
            <ProfileUrl href={website}>
              <FaUser className="text-[20px]" />
            </ProfileUrl>
          )}
        </center>
        <div className="relative top-0">
          <div
            className="border-[thin] border-[darkblue] rounded-[50%] border-solid
              w-[150px] h-[150px] max-w-[300px] ml-[25px] mr-[25px] my-0 bg-[#000000]"
          >
            <div
              className="rounded-[50%] border-none w-[148px] h-[148px] object-cover
                bg-[#000000] bg-center [background-size:105px] bg-no-repeat"
              style={{
                backgroundImage: `url(${
                  process.env.__NEXT_ROUTER_BASEPATH || ""
                }/cssu_logo.png)`,
              }}
            >
              {imageUrl && (
                <ProfileImage imageUrl={imageUrl} fullName={fullName} />
              )}
            </div>
          </div>
          <div className="block w-[170px] ml-[15px] mr-[15px] relative">
            <center className="text-base font-semibold">{fullName}</center>
          </div>
          <div className="block w-[170px] ml-[15px] mr-[15px] relative">
            <center className="text-sm">{position}</center>
          </div>
        </div>
      </div>
    </div>
  );
}
