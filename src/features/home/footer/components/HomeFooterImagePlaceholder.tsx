import { PhotoIcon } from "@heroicons/react/24/outline";

export default function HomeFooterImagePlaceholder() {
    return (
        <div className="flex-1 flex justify-center items-center min-w-0 h-full">
            <div className="bg-bg/15 rounded-xl aspect-square w-full max-h-full flex items-center justify-center">
                <PhotoIcon className="w-1/2 h-1/2 text-text-inverse" />
            </div>
        </div>
    );
}