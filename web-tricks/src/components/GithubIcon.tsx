import { siGithub } from "simple-icons";

interface GithubIconProps {
  size?: number;
}

export default function GithubIcon({ size = 24 }: GithubIconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
    >
      <path d={siGithub.path} />
    </svg>
  );
}
