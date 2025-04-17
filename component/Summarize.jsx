// components/Summarize.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Audio } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const Summarize = () => {
  const { videoId } = useLocalSearchParams();
  const [summary, setSummary] = useState('');
  const [takeaways, setTakeaways] = useState('');
  const [detailed, setDetailed] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.post('https://your-backend-api.com/generate-summary', {
          videoId: videoId,
        });

        setSummary(res.data.shortSummary);
        setDetailed(res.data.detailedSummary);
        setTakeaways(res.data.takeaways);
        setAudioUrl(res.data.audioUrl); // Optional
      } catch (err) {
        console.error('Summary fetch failed:', err);
      }
    };

    fetchSummary();
  }, [videoId]);

  const playAudio = async () => {
    if (!audioUrl) return;
    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
    await sound.playAsync();
  };

  return (
    <View style={styles.container}>
      <YoutubePlayer height={200} play={false} videoId={videoId} />

      <Text style={styles.title}>Summary Title</Text>

      <View style={styles.row}>
        <Text>❤️ 24</Text>
        <TouchableOpacity onPress={playAudio}><Text style={styles.audio}>🎧 34</Text></TouchableOpacity>
        <Text style={styles.audioLabel}>Audio Summary</Text>
      </View>

      <Text style={styles.description}>{summary}</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.btn}>
          <Text>{takeaways ? '✅ ' + takeaways : 'Loading...'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Text>{detailed ? '📖 ' + detailed : 'Loading...'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.feedbackBox}>
        <Text style={styles.feedbackText}>Loved the summary?</Text>
        <View style={styles.feedbackButtons}>
          <TouchableOpacity style={styles.thumbBtn}><Text>👍</Text></TouchableOpacity>
          <TouchableOpacity style={styles.thumbBtn}><Text>👎</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  audio: { fontSize: 18 },
  audioLabel: { fontSize: 12, color: '#555' },
  description: { marginTop: 10, fontSize: 14 },
  buttonGroup: { flexDirection: 'column', marginTop: 10, gap: 10 },
  btn: { backgroundColor: '#ddd', padding: 10, borderRadius: 8 },
  feedbackBox: {
    marginTop: 20, backgroundColor: '#cce5ff', padding: 15, borderRadius: 10,
  },
  feedbackText: { fontWeight: '600', marginBottom: 10 },
  feedbackButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  thumbBtn: { padding: 10, backgroundColor: '#fff', borderRadius: 6 },
});

export default Summarize;
