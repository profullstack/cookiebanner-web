import Papa from "https://esm.sh/papaparse@5.4.1";
import NDK, {
  NDKNip07Signer,
  NDKEvent,
} from "https://esm.sh/nostr-dev-kit@0.0.3/";
import {
  decodeNpub,
  extractProfileMetadataContent,
  fetchInvoice,
  getProfileMetadata,
  getZapEndpoint,
  listenForZapReceipt,
} from "/scripts/nostr.js";

async function zap_tools(npub) {
  const closePool = listenForZapReceipt({
    relays,
    invoice,
    onSuccess: () => {
      invoiceDialog.close();
    },
  });
}
async function zap_ndk(npub, amount = 10) {
  console.log("npub:", npub);
  const signer = new NDKNip07Signer();
  const ndk = new NDK({
    explicitRelayUrls: ["wss://relay.follows.lol", "wss://relay.primal.net"],
    signer,
  });

  await ndk.connect();

  const user = await signer.user();
  console.log("user:", user);
  const owner = await ndk.getUser({ npub });
  console.log("owner", owner);

  const invoice = await owner.zap(
    amount,
    "You earned some sats! https://zapwebring.com"
  );

  console.log("invoice:", invoice);
}

async function fetchCSV(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.text();
}

async function getWebRing() {
  const sheetId = "1uOVtv20ICDuLuNMd2gaX7as3XzLCHKBYaasAVbPcX-I";
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

  try {
    const csvData = await fetchCSV(url);
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true, // Set to true if your CSV has column headers
        complete: (results) => resolve(results.data),
        error: (error) => reject(error),
      });
    });
  } catch (error) {
    console.error("Error fetching or parsing CSV:", error);
  }
}

export { getWebRing, zap_ndk };
