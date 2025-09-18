const { createClient } = require("@deepgram/sdk");
const { AnalyticsLiveEvents } = require("@deepgram/sdk");

// Initialize the Deepgram client
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

/**
 * Example 1: Analyze a prerecorded conversation from URL
 */
async function analyzePrerecordedFromUrl() {
  console.log("=== Analyzing Prerecorded Conversation from URL ===");

  const audioSource = {
    url: "https://static.deepgram.com/examples/interview_speech-analytics.wav",
  };

  const options = {
    detect_speakers: true,
    extract_action_items: true,
    measure_engagement: true,
    detect_sentiment: true,
    conversation_summary: true,
    detect_questions: true,
    detect_key_phrases: true,
    min_speakers: 2,
    max_speakers: 4,
    language: "en-US",
  };

  try {
    const { result, error } = await deepgram.analytics.prerecorded.analyzeUrl(audioSource, options);

    if (error) {
      console.error("Error analyzing conversation:", error);
      return;
    }

    console.log("Analysis Results:");
    console.log("Conversation ID:", result.metadata.conversation_id);
    console.log("Duration:", result.metadata.duration, "seconds");
    console.log("Number of speakers:", result.metadata.num_speakers);
    
    // Speaker analysis
    console.log("\n--- Speaker Analysis ---");
    result.results.speakers.forEach((speaker, index) => {
      console.log(`Speaker ${speaker.speaker_id}:`);
      console.log(`  Speaking time: ${speaker.speaking_time}s (${speaker.speaking_percentage}%)`);
      console.log(`  Words per minute: ${speaker.words_per_minute}`);
      console.log(`  Interruptions made: ${speaker.interruptions_made}`);
      console.log(`  Engagement score: ${speaker.engagement_score}`);
    });

    // Action items
    if (result.results.action_items) {
      console.log("\n--- Action Items ---");
      result.results.action_items.forEach((item) => {
        console.log(`${item.priority?.toUpperCase() || "MEDIUM"}: ${item.text}`);
        console.log(`  Speaker: ${item.speaker_id}, Confidence: ${item.confidence}`);
      });
    }

    // Questions
    if (result.results.questions) {
      console.log("\n--- Questions ---");
      result.results.questions.forEach((question) => {
        console.log(`Q: ${question.text}`);
        console.log(`  Type: ${question.question_type}, Answered: ${question.answered}`);
      });
    }

    // Summary
    if (result.results.summary) {
      console.log("\n--- Conversation Summary ---");
      console.log("Overview:", result.results.summary.overview);
      console.log("Key Points:", result.results.summary.key_points.join(", "));
      console.log("Next Steps:", result.results.summary.next_steps.join(", "));
    }

  } catch (err) {
    console.error("Exception:", err);
  }
}

/**
 * Example 2: Analyze conversation with callback (asynchronous)
 */
async function analyzeWithCallback() {
  console.log("\n=== Analyzing with Callback (Async) ===");

  const audioSource = {
    url: "https://static.deepgram.com/examples/interview_speech-analytics.wav",
  };

  const callbackUrl = new URL("https://your-webhook-endpoint.com/analytics-callback");

  const options = {
    detect_speakers: true,
    extract_action_items: true,
    conversation_summary: true,
  };

  try {
    const { result, error } = await deepgram.analytics.prerecorded.analyzeUrlCallback(
      audioSource,
      callbackUrl,
      options
    );

    if (error) {
      console.error("Error starting async analysis:", error);
      return;
    }

    console.log("Async Analysis Started:");
    console.log("Request ID:", result.request_id);
    console.log("Conversation ID:", result.conversation_id);
    console.log("Status:", result.status);
    console.log("Results will be sent to:", result.callback_url);

  } catch (err) {
    console.error("Exception:", err);
  }
}

/**
 * Example 3: Retrieve existing analysis results
 */
async function retrieveAnalysis(conversationId) {
  console.log(`\n=== Retrieving Analysis for Conversation ${conversationId} ===`);

  try {
    const { result, error } = await deepgram.analytics.prerecorded.getAnalysis(conversationId);

    if (error) {
      console.error("Error retrieving analysis:", error);
      return;
    }

    console.log("Retrieved Analysis:");
    console.log("Conversation ID:", result.metadata.conversation_id);
    console.log("Created:", result.metadata.created);
    console.log("Duration:", result.metadata.duration, "seconds");

    // Show conversation dynamics
    console.log("\n--- Conversation Dynamics ---");
    console.log("Balance score:", result.results.dynamics.balance_score);
    console.log("Total interruptions:", result.results.dynamics.total_interruptions);
    console.log("Total silence time:", result.results.dynamics.total_silence_time, "seconds");

  } catch (err) {
    console.error("Exception:", err);
  }
}

/**
 * Example 4: Real-time conversation analytics
 */
function liveAnalyticsExample() {
  console.log("\n=== Real-time Conversation Analytics ===");

  const analyticsOptions = {
    detect_speakers: true,
    extract_action_items: true,
    measure_engagement: true,
    detect_sentiment: true,
    detect_interruptions: true,
    realtime_metrics_interval: 5.0,
    min_speakers: 2,
    max_speakers: 4,
    encoding: "linear16",
    sample_rate: 16000,
    channels: 1,
  };

  const live = deepgram.analytics.live(analyticsOptions);

  // Connection events
  live.on(AnalyticsLiveEvents.Open, () => {
    console.log("✅ Connected to live analytics");
    
    // Simulate sending audio data
    // In a real application, you'd pipe audio from microphone or audio stream
    console.log("Sending audio data...");
    const audioBuffer = Buffer.from("simulated audio data");
    live.send(audioBuffer);
  });

  live.on(AnalyticsLiveEvents.Close, (event) => {
    console.log("❌ Connection closed:", event.code, event.reason);
  });

  live.on(AnalyticsLiveEvents.Error, (error) => {
    console.error("🚨 Connection error:", error);
  });

  // Analytics events
  live.on(AnalyticsLiveEvents.SpeakerChange, (data) => {
    console.log("🎤 Speaker change detected:");
    console.log(`  From speaker ${data.event.data.previous_speaker_id || 'unknown'} to ${data.event.data.current_speaker_id}`);
    console.log(`  Confidence: ${data.event.data.confidence}`);
  });

  live.on(AnalyticsLiveEvents.ActionItem, (data) => {
    console.log("📋 Action item detected:");
    console.log(`  Text: "${data.event.data.text}"`);
    console.log(`  Priority: ${data.event.data.priority || 'medium'}`);
    console.log(`  Speaker: ${data.event.data.speaker_id}`);
  });

  live.on(AnalyticsLiveEvents.Question, (data) => {
    console.log("❓ Question detected:");
    console.log(`  Text: "${data.event.data.text}"`);
    console.log(`  Type: ${data.event.data.question_type || 'unknown'}`);
    console.log(`  Speaker: ${data.event.data.speaker_id}`);
  });

  live.on(AnalyticsLiveEvents.Interruption, (data) => {
    console.log("⚠️ Interruption detected:");
    console.log(`  Speaker ${data.event.data.interrupter_id} interrupted speaker ${data.event.data.interrupted_id}`);
    console.log(`  Severity: ${data.event.data.severity}`);
    console.log(`  Duration: ${data.event.data.duration}s`);
  });

  live.on(AnalyticsLiveEvents.SentimentChange, (data) => {
    console.log("🎭 Sentiment change detected:");
    console.log(`  Speaker: ${data.event.data.speaker_id}`);
    console.log(`  From: ${data.event.data.from_sentiment.sentiment} (${data.event.data.from_sentiment.confidence})`);
    console.log(`  To: ${data.event.data.to_sentiment.sentiment} (${data.event.data.to_sentiment.confidence})`);
    console.log(`  Significance: ${data.event.data.significance}`);
  });

  live.on(AnalyticsLiveEvents.KeyPhrase, (data) => {
    console.log("🔑 Key phrase detected:");
    console.log(`  Phrase: "${data.event.data.phrase}"`);
    console.log(`  Importance: ${data.event.data.importance_score}`);
    console.log(`  Speaker: ${data.event.data.speaker_id}`);
  });

  live.on(AnalyticsLiveEvents.Silence, (data) => {
    console.log("🤫 Silence detected:");
    console.log(`  Duration: ${data.event.data.duration}s`);
    console.log(`  Context: ${data.event.data.context}`);
  });

  live.on(AnalyticsLiveEvents.MetricsUpdate, (data) => {
    console.log("📊 Metrics update:");
    console.log(`  Interval: ${data.event.data.interval_start}s - ${data.event.data.interval_end}s`);
    console.log(`  Total speaking time: ${data.event.data.conversation_metrics.total_speaking_time}s`);
    console.log(`  Turn count: ${data.event.data.conversation_metrics.turn_count}`);
    console.log(`  Engagement level: ${data.event.data.conversation_metrics.engagement_level}`);
    
    data.event.data.speakers.forEach((speaker) => {
      console.log(`    Speaker ${speaker.speaker_id}: ${speaker.speaking_time_total}s total, ${speaker.engagement_score} engagement`);
    });
  });

  live.on(AnalyticsLiveEvents.Unhandled, (data) => {
    console.log("❓ Unhandled event:", data.event?.event_type);
  });

  // Keep connection alive for demo purposes
  const keepAliveInterval = setInterval(() => {
    live.keepAlive();
  }, 30000);

  // Close connection after 60 seconds for demo
  setTimeout(() => {
    console.log("Closing live analytics connection...");
    clearInterval(keepAliveInterval);
    live.requestClose();
  }, 60000);

  return live;
}

/**
 * Example 5: Advanced configuration and control
 */
function advancedLiveExample() {
  console.log("\n=== Advanced Live Analytics Configuration ===");

  const live = deepgram.analytics.live({
    detect_speakers: true,
    min_speakers: 2,
    max_speakers: 6,
    speaker_labels: ["Agent", "Customer", "Manager"],
    customer_speaker_id: 1,
    agent_speaker_id: 0,
    detect_interruptions: true,
    extract_action_items: true,
    measure_engagement: true,
    detect_sentiment: true,
    detect_questions: true,
    detect_key_phrases: true,
    silence_threshold: 2.0,
    realtime_metrics_interval: 10.0,
    encoding: "linear16",
    sample_rate: 16000,
    language: "en-US",
  });

  live.on(AnalyticsLiveEvents.Open, () => {
    console.log("Connected with advanced configuration");

    // Update configuration mid-session
    setTimeout(() => {
      console.log("Updating session configuration...");
      live.configure({
        features: {
          detect_sentiment: false,  // Disable sentiment tracking
          extract_action_items: true,
          measure_engagement: true,
        },
        realtime_metrics_interval: 15.0,  // Update to every 15 seconds
      });
    }, 30000);

    // Send custom control message
    setTimeout(() => {
      console.log("Sending custom control message...");
      live.sendControlMessage({
        type: "UpdateSpeakerLabels",
        labels: ["Agent", "Customer", "Supervisor", "Technical Support"],
      });
    }, 45000);
  });

  live.on(AnalyticsLiveEvents.Close, () => {
    console.log("Advanced session closed");
  });

  return live;
}

// Run examples
async function runExamples() {
  if (!process.env.DEEPGRAM_API_KEY) {
    console.error("Please set the DEEPGRAM_API_KEY environment variable");
    process.exit(1);
  }

  try {
    // Run prerecorded analysis
    await analyzePrerecordedFromUrl();

    // Run async analysis with callback
    await analyzeWithCallback();

    // Example of retrieving existing analysis
    // await retrieveAnalysis("your-conversation-id-here");

    // Run live analytics (uncomment to test)
    // const liveSession = liveAnalyticsExample();

    // Run advanced live analytics (uncomment to test)
    // const advancedSession = advancedLiveExample();

  } catch (error) {
    console.error("Error running examples:", error);
  }
}

// Only run examples if this file is executed directly
if (require.main === module) {
  runExamples();
}

module.exports = {
  analyzePrerecordedFromUrl,
  analyzeWithCallback,
  retrieveAnalysis,
  liveAnalyticsExample,
  advancedLiveExample,
};