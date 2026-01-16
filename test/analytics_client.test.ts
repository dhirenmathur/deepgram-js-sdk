import { createClient } from "./helpers";
import { expect } from "chai";
import { AnalyticsClient, AnalyticsRestClient, AnalyticsLiveClient } from "../src/packages";

const deepgram = createClient();

describe("AnalyticsClient", () => {
  it("should create AnalyticsClient instance", () => {
    const client = deepgram.analytics;
    expect(client).to.be.instanceOf(AnalyticsClient);
    expect(client.namespace).to.equal("analytics");
  });

  it("should provide access to REST client", () => {
    const restClient = deepgram.analytics.rest;
    expect(restClient).to.be.instanceOf(AnalyticsRestClient);
    expect(restClient.namespace).to.equal("analytics");
  });

  it("should provide access to live client", () => {
    const liveClient = deepgram.analytics.live();
    expect(liveClient).to.be.instanceOf(AnalyticsLiveClient);
    expect(liveClient.namespace).to.equal("analytics");
  });

  it("should create live client with options", () => {
    const liveClient = deepgram.analytics.live({
      detect_speakers: true,
      extract_action_items: true,
      language: "en",
    });
    expect(liveClient).to.be.instanceOf(AnalyticsLiveClient);
  });

  it("should create live client with custom endpoint", () => {
    const customEndpoint = ":version/analyze/conversation/stream/custom";
    const liveClient = deepgram.analytics.live({}, customEndpoint);
    expect(liveClient).to.be.instanceOf(AnalyticsLiveClient);
  });
});