import { collegeKnowledge } from '../knowledge/collegeData';

export const searchKnowledge = (question) => {
  const q = question.toLowerCase();
  
  const results = collegeKnowledge.filter(item => {
    // Basic keyword extraction matching from topic
    const topicKeywords = item.topic.toLowerCase().split(' ');
    
    // Also check if the raw topic word is straight up in the question
    if (q.includes(item.topic.toLowerCase())) {
      return true;
    }

    return topicKeywords.some(keyword => keyword.length > 2 && q.includes(keyword));
  });

  if (results.length > 0) {
    return results.map(r => r.content).join('\n');
  }

  return "No general college information was found relevant to this query.";
};
