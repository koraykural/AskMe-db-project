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
  upvoteCount: number;
  downvoteCount: number;
  userVote: boolean | null;
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
