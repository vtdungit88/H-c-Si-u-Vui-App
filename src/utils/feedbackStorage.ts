export interface UserFeedback {
  id: string;
  studentName: string;
  grade: string;
  school: string;
  contact?: string;
  category: 'suggestion' | 'bug' | 'compliment' | 'question' | 'other';
  message: string;
  rating: number; // 1 to 5
  createdAt: string;
  resolved?: boolean;
}

const FEEDBACKS_STORAGE_KEY = 'hsv_user_feedbacks';

export function getUserFeedbacks(): UserFeedback[] {
  try {
    const raw = localStorage.getItem(FEEDBACKS_STORAGE_KEY);
    if (!raw) {
      // Seed with 2 sample realistic feedbacks
      const sampleFeedbacks: UserFeedback[] = [
        {
          id: 'fb_1',
          studentName: 'Bảo Nam',
          grade: 'Lớp 6A2',
          school: 'THCS Lê Quý Đôn',
          contact: 'baonam.lequy@gmail.com',
          category: 'suggestion',
          message: 'Ứng dụng rất vui, em thích nhất Studio đổi quần áo xe đạp thể thao! Thầy cô cho thêm nhiều bài toán hình học nữa nhé ạ!',
          rating: 5,
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          resolved: false
        },
        {
          id: 'fb_2',
          studentName: 'Khánh Linh',
          grade: 'Lớp 6B',
          school: 'THCS Trưng Vương',
          contact: '',
          category: 'compliment',
          message: 'Em vừa làm xong bài phân số được 3 xu và 1 sao! Mẹo vui bên dưới rất dễ nhớ công thức ạ!',
          rating: 5,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          resolved: true
        }
      ];
      localStorage.setItem(FEEDBACKS_STORAGE_KEY, JSON.stringify(sampleFeedbacks));
      return sampleFeedbacks;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserFeedback(feedback: Omit<UserFeedback, 'id' | 'createdAt'>): UserFeedback {
  const current = getUserFeedbacks();
  const newFb: UserFeedback = {
    ...feedback,
    id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    resolved: false
  };

  const updated = [newFb, ...current];
  try {
    localStorage.setItem(FEEDBACKS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save feedback:', e);
  }
  return newFb;
}

export function deleteUserFeedback(id: string): void {
  const current = getUserFeedbacks();
  const updated = current.filter(fb => fb.id !== id);
  try {
    localStorage.setItem(FEEDBACKS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete feedback:', e);
  }
}

export function toggleResolveFeedback(id: string): void {
  const current = getUserFeedbacks();
  const updated = current.map(fb => fb.id === id ? { ...fb, resolved: !fb.resolved } : fb);
  try {
    localStorage.setItem(FEEDBACKS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to toggle feedback:', e);
  }
}
