export interface ApiError {
  status: 'Error';
  message: string;
}

export interface ApiResponse {
  status: 'Success';
}

export interface QuestionData {
  anonymous: boolean;
  owner: string;
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
