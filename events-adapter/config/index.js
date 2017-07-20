module.exports = {
  kafka: {
    host: process.env.COMMUNITY_ZOOKEEPER_HOST || '172.23.238.134',
    port: process.env.COMMUNITY_ZOOKEEPER_PORT || '2181',
    event_host: process.env.ACTIVITY_ZOOKEEPER_HOST || '172.23.238.134',
    event_port: process.env.ACTIVITY_ZOOKEEPER_PORT || '2181',
    communityLifecycleTopic: process.env.COMMUNITY_LIFECYCLE_TOPIC || 'CommunityLifecycle',
    communityActivityEventTopic: process.env.COMMUNITY_ACTIVITY_TOPIC || 'CommunityActivityEvent',
    eventsTopic: process.env.EVENTS_TOPIC || 'events',
    options: {
      groupId: process.env.CONSUMER_GROUP || 'community',
      autoCommit: false,
      fromOffset: true,
    },
  },
  }
