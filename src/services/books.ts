export type Book = {
  id: string;
  title: string;
  author: string;
  imageLink: string;
  subTitle?: string;
  summary?: string;
  bookDescription?: string;
  authorDescription?: string;
  audioLink?: string;
  subscriptionRequired?: boolean;
  tags?: string[];
  averageRating?: number;
  type?: string;
  status?: string;
};

const BASE_URL =
  "https://us-central1-summaristt.cloudfunctions.net";

export async function getSelectedBook(): Promise<Book> {
  const res = await fetch(`${BASE_URL}/getBooks?status=selected`);

  if (!res.ok) {
    throw new Error("Failed to fetch selected book");
  }

  const data: Book[] = await res.json();
  return data[0];
}

export async function getRecommendedBooks(): Promise<Book[]> {
  const res = await fetch(`${BASE_URL}/getBooks?status=recommended`);

  if (!res.ok) {
    throw new Error("Failed to fetch recommended books");
  }

  return res.json();
}

export async function getSuggestedBooks(): Promise<Book[]> {
  const res = await fetch(`${BASE_URL}/getBooks?status=suggested`);

  if (!res.ok) {
    throw new Error("Failed to fetch suggested books");
  }

  return res.json();
}

export async function searchBooks(query: string): Promise<Book[]> {
  const res = await fetch(
    `${BASE_URL}/getBooksByAuthorOrTitle?search=${query}`
  );

  if (!res.ok) {
    throw new Error("Failed to search books");
  }

  return res.json();
}
