import { DisplaySettings } from "@/types/display-settings.type";
import { FirebaseSettings } from "@/types/firebase-settings.type";
import { TimeSettings } from "@/types/time-settings.type";
import { WifiSettings } from "@/types/wifi-settings.type";

const endpoint = "/api";

function getFullUrl(
  path: string,
  parameters: string[] | undefined = undefined
): string {
  if (parameters) {
    return `${endpoint}/${path}?${parameters.join("&")}`;
  }
  return `${endpoint}/${path}`;
}

async function getDisplaySettings(): Promise<DisplaySettings> {
  const response = await fetch(getFullUrl("display"));
  return response.json();
}

async function updateDisplaySettings(
  displaySettings: DisplaySettings
): Promise<void> {
  await fetch(getFullUrl("display"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(displaySettings),
  });
}

async function getWifiSettings(): Promise<WifiSettings> {
  const response = await fetch(getFullUrl("wifi"));
  return response.json();
}

async function updateWifiSettings(wifiSettings: WifiSettings): Promise<void> {
  await fetch(getFullUrl("wifi"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(wifiSettings),
  });
}

async function getTimeSettings(): Promise<TimeSettings> {
  const response = await fetch(getFullUrl("time"));
  return response.json();
}

async function updateTimeSettings(timeSettings: TimeSettings): Promise<void> {
  await fetch(getFullUrl("time"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(timeSettings),
  });
}

async function getFirebaseSettings(): Promise<FirebaseSettings> {
  const response = await fetch(getFullUrl("firebase"));
  return response.json();
}

async function updateFirebaseSettings(
  firebaseSettings: FirebaseSettings
): Promise<void> {
  await fetch(getFullUrl("firebase"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(firebaseSettings),
  });
}

async function reset(): Promise<void> {
  await fetch(getFullUrl("reset"), {
    method: "POST",
  });
}

export default {
  getDisplaySettings,
  updateDisplaySettings,
  getWifiSettings,
  updateWifiSettings,
  getTimeSettings,
  updateTimeSettings,
  getFirebaseSettings,
  updateFirebaseSettings,
  reset,
};
