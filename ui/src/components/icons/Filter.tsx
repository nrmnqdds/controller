import React from "react";
import Icon from "./Icon";

export function Filter({ className }: { className: string }) {
  return (
    <Icon className={className}>
      <path
        d="M2 4.62891C2 3.7293 2.7293 3 3.62891 3H20.3711C21.2695 3 22 3.7293 22 4.62891C22 5.00391 21.8711 5.36719 21.6328 5.65625L15.125 13.6445V19.2383C15.125 19.9336 14.5586 20.5 13.8633 20.5C13.5781 20.5 13.3008 20.4023 13.0781 20.1914L9.46484 17.3594C9.09375 17.0625 8.875 16.6133 8.875 16.1367V13.6445L2.36613 5.65625C2.12934 5.36719 2 5.00391 2 4.62891ZM4.14687 4.875L10.5391 12.7188C10.6758 12.8867 10.75 13.0977 10.75 13.3125V15.9844L13.25 17.9688V13.3125C13.25 13.0977 13.3242 12.8867 13.4609 12.7188L19.8516 4.875H4.14687Z"
        fill="black"
      />
    </Icon>
  );
}

export default Filter;
