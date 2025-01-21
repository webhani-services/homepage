export default function AreaContact() {
  return (
    <section id="contact" className="section-padding bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="heading-primary text-center">お問い合わせ</h2>
        <p className="paragraph text-center mb-12">
          ご質問やご相談がございましたら、お気軽にお問い合わせください
        </p>

        <form className="space-y-6 fade-in">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              お名前
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-gray-700 font-medium mb-2"
            >
              お問い合わせ内容
            </label>
            <textarea
              id="message"
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full md:w-auto md:px-12 py-3 bg-yellow-300 hover:bg-yellow-400
              text-gray-900 font-medium rounded-lg transition-all duration-300
              shadow-sm hover:shadow-md"
            >
              送信する
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
