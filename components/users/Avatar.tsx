import React from "react";
import styles from "./Avatar.module.css";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * https://liveblocks.io/docs/examples/live-avatars
 *
 * The users avatar and name are not set via the `useMyPresence` hook like the cursors.
 * They are set from the authentication endpoint.
 *
 * See pages/api/liveblocks-auth.ts and https://liveblocks.io/docs/api-reference/liveblocks-node#authorize for more information
 */

const IMAGE_SIZE = 48;

export function Avatar({
  src,
  name,
  otherStyles,
}: {
  src?: string;
  name: string;
  otherStyles?: string;
}) {
  const dynamicImg = `https://liveblocks.io/avatars/avatar-${Math.floor(
    Math.random() * 30
  )}.png`;

  return (
    <div className={cn(styles.avatar, otherStyles)} data-tooltip={name}>
      <Image
        src={dynamicImg}
        className={styles.avatar_picture}
        fill
        alt={name}
      />
    </div>
  );
}
