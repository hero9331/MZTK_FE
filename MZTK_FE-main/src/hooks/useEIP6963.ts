import { useSyncExternalStore } from "react";
import type { EIP6963ProviderDetail } from "../global";

declare global {
    interface WindowEventMap {
        "eip6963:announceProvider": CustomEvent<EIP6963ProviderDetail>;
    }
}

let providers: EIP6963ProviderDetail[] = [];

export const store = {
    value: () => providers,
    subscribe: (callback: () => void) => {
        function onAnnouncement(event: CustomEvent<EIP6963ProviderDetail>) {
            if (providers.map((p) => p.info.uuid).includes(event.detail.info.uuid))
                return;
            providers = [...providers, event.detail];
            callback();
        }
        window.addEventListener("eip6963:announceProvider", onAnnouncement);
        window.dispatchEvent(new Event("eip6963:requestProvider"));

        return () =>
            window.removeEventListener("eip6963:announceProvider", onAnnouncement);
    },
};

export const useEIP6963 = () => useSyncExternalStore(store.subscribe, store.value);
