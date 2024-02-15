import React from "react";
import Icon from "@mdi/react";
import {
  mdiPhoneOutline,
  mdiWalletBifoldOutline,
  mdiEmailOpenOutline,
} from "@mdi/js";

function FooterIteam({ heading, items }) {
  return (
    <div className="mb-8 w-[250px] p-3">
      <div className="space-y-4">
        <p className="text-2xl">{heading}</p>
        <div className="flex flex-col gap-5 pt-4">
          {items.map((item) => (
            <p key={item} className="">
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FooterIteam;
