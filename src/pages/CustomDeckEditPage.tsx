import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCustomDecks } from '../hooks/useCustomDecks';
import type { PhraseItem } from '../data/types';

type ItemFormState = {
  english: string;
  japanese: string;
  pronunciation: string;
  example: string;
  exampleJa: string;
};

const emptyForm = (): ItemFormState => ({
  english: '',
  japanese: '',
  pronunciation: '',
  example: '',
  exampleJa: '',
});

export default function CustomDeckEditPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const { getDeck, renameDeck, addItem, updateItem, removeItem } = useCustomDecks();

  const deck = getDeck(deckId ?? '');
  const deckIdentity = deck?.id;
  const getDeckRef = useRef(getDeck);

  // Deck rename form
  const [deckName, setDeckName] = useState(deck?.name ?? '');
  const [deckDesc, setDeckDesc] = useState(deck?.description ?? '');
  const [deckSaved, setDeckSaved] = useState(false);

  useEffect(() => {
    getDeckRef.current = getDeck;
  }, [getDeck]);

  useEffect(() => {
    if (!deckIdentity) return;
    const latestDeck = getDeckRef.current(deckIdentity);
    if (!latestDeck) return;
    setDeckName(latestDeck.name);
    setDeckDesc(latestDeck.description ?? '');
    setDeckSaved(false);
  }, [deckIdentity]);

  // Add word form
  const [addForm, setAddForm] = useState<ItemFormState>(emptyForm());
  const [addError, setAddError] = useState('');

  // Inline edit state: itemId -> form values
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ItemFormState>(emptyForm());

  // Confirm-delete state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Not found state
  if (!deck) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">📭</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          単語帳が見つかりません
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          このIDの単語帳は存在しないか、削除されました。
        </p>
        <Link
          to="/decks"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
        >
          ← 単語帳一覧に戻る
        </Link>
      </div>
    );
  }

  // Deck name save
  const handleSaveDeck = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = deckName.trim();
    if (!trimmed) return;
    renameDeck(deck.id, trimmed, deckDesc.trim() || undefined);
    setDeckSaved(true);
    setTimeout(() => setDeckSaved(false), 2000);
  };

  // Add item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const english = addForm.english.trim();
    const japanese = addForm.japanese.trim();
    if (!english || !japanese) {
      setAddError('英語と日本語は必須です。');
      return;
    }
    setAddError('');
    const fields: Omit<PhraseItem, 'id'> = {
      english,
      japanese,
      pronunciation: addForm.pronunciation.trim(),
      example: addForm.example.trim() || undefined,
      exampleJa: addForm.exampleJa.trim() || undefined,
    };
    addItem(deck.id, fields);
    setAddForm(emptyForm());
  };

  // Start inline edit
  const handleStartEdit = (item: PhraseItem) => {
    setEditingId(item.id);
    setEditForm({
      english: item.english,
      japanese: item.japanese,
      pronunciation: item.pronunciation,
      example: item.example ?? '',
      exampleJa: item.exampleJa ?? '',
    });
    setConfirmDeleteId(null);
  };

  // Save inline edit
  const handleSaveEdit = (e: React.FormEvent, itemId: string) => {
    e.preventDefault();
    const english = editForm.english.trim();
    const japanese = editForm.japanese.trim();
    if (!english || !japanese) return;
    updateItem(deck.id, itemId, {
      english,
      japanese,
      pronunciation: editForm.pronunciation.trim(),
      example: editForm.example.trim() || undefined,
      exampleJa: editForm.exampleJa.trim() || undefined,
    });
    setEditingId(null);
  };

  // Delete item
  const handleDelete = (itemId: string) => {
    removeItem(deck.id, itemId);
    setConfirmDeleteId(null);
    if (editingId === itemId) setEditingId(null);
  };

  return (
    <div>
      {/* Back link + heading */}
      <div className="mb-6">
        <Link
          to="/decks"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors mb-4"
        >
          ← 単語帳一覧
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">✏️</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              単語帳を編集
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 tabular-nums">
              {deck.items.length} 語
            </p>
          </div>
        </div>
      </div>

      {/* Deck name / description */}
      <section
        aria-labelledby="deck-meta-heading"
        className="mb-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
      >
        <h2
          id="deck-meta-heading"
          className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4"
        >
          単語帳の情報
        </h2>
        <form onSubmit={handleSaveDeck} className="space-y-3">
          <div>
            <label
              htmlFor="deck-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              名前 <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id="deck-name"
              type="text"
              required
              value={deckName}
              onChange={(e) => { setDeckName(e.target.value); setDeckSaved(false); }}
              placeholder="例: TOEIC頻出単語"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent min-h-[44px]"
            />
          </div>
          <div>
            <label
              htmlFor="deck-desc"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              説明（任意）
            </label>
            <input
              id="deck-desc"
              type="text"
              value={deckDesc}
              onChange={(e) => { setDeckDesc(e.target.value); setDeckSaved(false); }}
              placeholder="例: Part 5対策"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent min-h-[44px]"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm min-h-[44px] focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 cursor-pointer"
            >
              保存
            </button>
            {deckSaved && (
              <p role="status" className="text-sm text-green-600 dark:text-green-400 font-medium">
                保存しました
              </p>
            )}
          </div>
        </form>
      </section>

      {/* Add word form */}
      <section
        aria-labelledby="add-word-heading"
        className="mb-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
      >
        <h2
          id="add-word-heading"
          className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4"
        >
          単語を追加
        </h2>
        <form onSubmit={handleAddItem} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="add-english"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                英語 <span aria-hidden="true" className="text-red-500">*</span>
              </label>
              <input
                id="add-english"
                type="text"
                value={addForm.english}
                onChange={(e) => { setAddForm((f) => ({ ...f, english: e.target.value })); setAddError(''); }}
                placeholder="例: appointment"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent min-h-[44px]"
              />
            </div>
            <div>
              <label
                htmlFor="add-japanese"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                日本語 <span aria-hidden="true" className="text-red-500">*</span>
              </label>
              <input
                id="add-japanese"
                type="text"
                value={addForm.japanese}
                onChange={(e) => { setAddForm((f) => ({ ...f, japanese: e.target.value })); setAddError(''); }}
                placeholder="例: 約束、予定"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent min-h-[44px]"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="add-pronunciation"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              発音（任意）
            </label>
            <input
              id="add-pronunciation"
              type="text"
              value={addForm.pronunciation}
              onChange={(e) => setAddForm((f) => ({ ...f, pronunciation: e.target.value }))}
              placeholder="例: əˈpɔɪntmənt"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent min-h-[44px]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="add-example"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                例文（任意）
              </label>
              <input
                id="add-example"
                type="text"
                value={addForm.example}
                onChange={(e) => setAddForm((f) => ({ ...f, example: e.target.value }))}
                placeholder="例: I have an appointment at 3."
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent min-h-[44px]"
              />
            </div>
            <div>
              <label
                htmlFor="add-example-ja"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                例文（日本語・任意）
              </label>
              <input
                id="add-example-ja"
                type="text"
                value={addForm.exampleJa}
                onChange={(e) => setAddForm((f) => ({ ...f, exampleJa: e.target.value }))}
                placeholder="例: 3時に約束があります。"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent min-h-[44px]"
              />
            </div>
          </div>
          {addError && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {addError}
            </p>
          )}
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm min-h-[44px] focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 cursor-pointer"
          >
            ＋ 追加
          </button>
        </form>
      </section>

      {/* Word list */}
      <section aria-labelledby="word-list-heading">
        <h2
          id="word-list-heading"
          className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4"
        >
          登録済みの単語
          <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400 tabular-nums">
            ({deck.items.length} 語)
          </span>
        </h2>

        {deck.items.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
            <p className="text-4xl mb-3" aria-hidden="true">📝</p>
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
              まだ単語がありません
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              上のフォームから単語を追加しましょう。
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {deck.items.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
              >
                {editingId === item.id ? (
                  /* Inline edit form */
                  <form
                    onSubmit={(e) => handleSaveEdit(e, item.id)}
                    className="p-4 space-y-3"
                    aria-label={`「${item.english}」を編集`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor={`edit-english-${item.id}`}
                          className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
                        >
                          英語 <span aria-hidden="true" className="text-red-500">*</span>
                        </label>
                        <input
                          id={`edit-english-${item.id}`}
                          type="text"
                          required
                          value={editForm.english}
                          onChange={(e) => setEditForm((f) => ({ ...f, english: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`edit-japanese-${item.id}`}
                          className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
                        >
                          日本語 <span aria-hidden="true" className="text-red-500">*</span>
                        </label>
                        <input
                          id={`edit-japanese-${item.id}`}
                          type="text"
                          required
                          value={editForm.japanese}
                          onChange={(e) => setEditForm((f) => ({ ...f, japanese: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[44px]"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor={`edit-pronunciation-${item.id}`}
                        className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
                      >
                        発音
                      </label>
                      <input
                        id={`edit-pronunciation-${item.id}`}
                        type="text"
                        value={editForm.pronunciation}
                        onChange={(e) => setEditForm((f) => ({ ...f, pronunciation: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[44px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor={`edit-example-${item.id}`}
                          className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
                        >
                          例文
                        </label>
                        <input
                          id={`edit-example-${item.id}`}
                          type="text"
                          value={editForm.example}
                          onChange={(e) => setEditForm((f) => ({ ...f, example: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`edit-example-ja-${item.id}`}
                          className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
                        >
                          例文（日本語）
                        </label>
                        <input
                          id={`edit-example-ja-${item.id}`}
                          type="text"
                          value={editForm.exampleJa}
                          onChange={(e) => setEditForm((f) => ({ ...f, exampleJa: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[44px]"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 cursor-pointer"
                      >
                        保存
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2 cursor-pointer"
                      >
                        キャンセル
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Display row */
                  <div className="p-4 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-bold text-gray-900 dark:text-gray-100 leading-snug">
                        {item.english}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                        {item.japanese}
                      </p>
                      {item.pronunciation && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {item.pronunciation}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="min-h-[44px] px-3 py-1.5 inline-flex items-center rounded-lg border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 cursor-pointer"
                        aria-label={`「${item.english}」を編集`}
                      >
                        編集
                      </button>
                      {confirmDeleteId === item.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="min-h-[44px] px-3 py-1.5 inline-flex items-center rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 cursor-pointer"
                          >
                            削除確認
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="min-h-[44px] px-3 py-1.5 inline-flex items-center rounded-lg border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2 cursor-pointer"
                          >
                            キャンセル
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="min-h-[44px] w-10 inline-flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 cursor-pointer"
                          aria-label={`「${item.english}」を削除`}
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
