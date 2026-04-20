import PageLoader from "./PageLoader";

export default function HomeLayout() {
    return (
        <PageLoader>
            <div className="flex flex-row min-h-screen justify-center items-center">
                <h1 className="text-3xl font-semibold p-4">
                    HomeLayout Component
                </h1>
            </div>
        </PageLoader>
    );
}