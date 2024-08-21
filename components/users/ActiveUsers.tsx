import { useOthers, useSelf } from "@/liveblocks.config";
import { Avatar } from "./Avatar";
import styles from "./index.module.css";
import { generateRandomName } from "@/lib/utils";
import { useMemo } from "react";

function ActiveUsers() {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > 3;

  const memoizedUsers = useMemo(() => {
    return (
      <main className="flex items-center justify-center gap-0 py-2">
        {/* Show your own avatar */}
        {currentUser && (
          <div className="relative ml-8 first:ml-0">
            <Avatar name="You" otherStyles="border-4 border-primary-green" />
          </div>
        )}

        {/* Show other users' avatars */}
        <div className="flex">
          {users.slice(0, 3).map(({ connectionId }) => {
            return (
              <Avatar
                key={connectionId}
                name={generateRandomName()}
                otherStyles="-ml-3"
              />
            );
          })}

          {/* Show more users' avatars if there are more than 3 users online */}
          {hasMoreUsers && (
            <div className={styles.more}>+{users.length - 3}</div>
          )}
        </div>
      </main>
    );
  }, [users.length]);

  return memoizedUsers;
}

export default ActiveUsers;
