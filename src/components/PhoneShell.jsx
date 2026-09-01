export default function PhoneShell({ children }) {
    return (
        <div className="h-dvh flex items-center justify-center bg-zinc-950 sm:p-4">
            <div className="w-full h-full flex flex-col bg-black
                      sm:w-[420px] sm:max-h-[880px] sm:rounded-[32px]
                      sm:border-4 sm:border-zinc-800 sm:overflow-hidden">
                {children}
            </div>
        </div>
    )
}