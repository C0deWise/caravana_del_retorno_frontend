import os from "node:os";

export function getLocalDevOrigins(port: number = 3000): string[] {
  const interfaces = os.networkInterfaces();
  const origins: string[] = [];

  const networkUrls: string[] = [];

  for (const interfaceKey of Object.keys(interfaces)) {
    const networkAddresses = interfaces[interfaceKey];
    if (!networkAddresses) continue;

    for (const addressInfo of networkAddresses) {
      if (addressInfo.family === "IPv4" && !addressInfo.internal) {
        origins.push(addressInfo.address);
        origins.push(`${addressInfo.address}:${port}`);
        networkUrls.push(`http://${addressInfo.address}:${port}`);
      }
    }
  }

  const globalForLog = globalThis as typeof globalThis & {
    __devNetworkLogged?: boolean;
  };
  if (networkUrls.length > 0 && !globalForLog.__devNetworkLogged) {
    globalForLog.__devNetworkLogged = true;
    console.log(`\n  ➜  Red local: ${networkUrls.join(" | ")}\n`);
  }

  return origins;
}
