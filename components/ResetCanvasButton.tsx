import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";
import { ActiveElement } from "@/types/type";

export default function ResetCanvasButton({
  handleActiveElement,
  item,
  isActive,
}: {
  handleActiveElement: (item: ActiveElement) => void;
  item: any;
  isActive: (item: any) => boolean;
}) {
  const resetAction = () => {
    handleActiveElement(item);
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-5 h-5 relative object-contain">
            <Image
              src={item.icon}
              alt={item.name}
              fill
              className={cn("", isActive(item) ? "invert" : "")}
            />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="text-white bg-primary-grey-100 border-0">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset the canvas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="px-6 py-2 rounded-full font-semibold transition-colors duration-300 hover:bg-black border-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={resetAction}
              className="hover:bg-red-500 px-6 py-2 rounded-full font-semibold transition-colors duration-300"
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
