import { DotSpinner } from "@uiball/loaders";

export default function Loader() {
    return (
        <div className="loader-container">
            <div style={{ display: "flex", justifyContent: "center" }}>
                <DotSpinner
                    size={60}
                    speed={0.6}
                    color="black"
                />
            </div>
        </div>
    )
}