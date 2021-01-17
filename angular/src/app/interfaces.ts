export interface ApiError {
  status: 'Error';
  message: string;
}

export interface ApiResponse {
  status: 'Success';
}

export interface QuestionData {
  id: number;
  anonymous: boolean;
  owner: string;
  ownername: string;
  questionType: string;
  questionText: string;
  answerType: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  correctAnswer: number;
  upvoteCount: number;
  downvoteCount: number;
  userVote: boolean | null;
  userAnswer: string | null;
  createdAt: Date;
}

export interface QuestionForm {
  anonymous: boolean;
  questionType: string;
  questionText: string;
  answerType: string;
  answer1?: string;
  answer2?: string;
  answer3?: string;
  answer4?: string;
  correctAnswer?: number;
}

export enum AnswerTypes {
  'text' = 'text',
  'multi-choice-2' = 'multi-choice-2',
  'multi-choice-4' = 'multi-choice-4',
}

export interface ContactForm {
  name: string;
  _replyto: string;
  _subject: string;
  message: string;
}

export interface Answer {
  answer: string;
  username: string;
  questionId: number;
  userId: string;
  likes: number;
  dislikes: number;
  edited: boolean;
  createdAt: Date;
}

export interface Statistics {
  questionCount: number;
  totalUpvote: number;
  maxUpvote: number;
  totalDownvote: number;
  maxDownvote: number;
  totalAnswers: number;
  maxAnswers: number;
}

export interface MultiAnswer {
  choice: '1' | '2' | '3' | '4';
  count: number;
}
