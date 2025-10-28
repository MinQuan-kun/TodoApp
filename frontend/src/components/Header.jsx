import React from 'react';

export const Header = () => {
    return (
        <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold text-transparent bg-primary bg-clip-text">
                To-Do App
            </h1>

            <p className="text-muted-foreground "> Không có việc gì khó, chí sợ lòng không bền</p>
        </div>
    );
};

export default Header;