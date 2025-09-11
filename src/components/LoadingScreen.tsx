import React from "react";

const LoadingScreen = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="text-center max-w-max mx-auto">
                <div className="w-20 h-20 mx-auto mb-8 bg-[#1c6ed0] rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    Analyzing Your Responses...
                </h2>
                <p className="text-gray-600">
                    Our AI is crafting personalized recommendations just for you
                </p>
                <div className="flex justify-center space-x-2 mt-6">
                    <div className="w-3 h-3 bg-[#1c6ed0] rounded-full animate-bounce"></div>
                    <div
                        className="w-3 h-3 size-5 bg-[#1c6ed0] rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                        className="w-3 h-3 bg-[#1c6ed0] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
