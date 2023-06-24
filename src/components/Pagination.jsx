import React from "react";

// 문제점 : 다른 페이지 넘버에 갔다가 이전 페이지 넘버로 이동 시 두개가 합쳐지는 현상 발생 => map함수로 컴포넌트 그릴때 각 컴포넌트가 다른 Id를 가지고 있으면 문제 발생하지 않음
function Pagination({ total, limit, page, setPage }) {
  const numPages = Math.ceil(total / limit);

  return (
    <>
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="h-full disabled:text-gray-400 disabled:cursor-default"
      >
        &lt;
      </button>
      {Array(numPages)
        .fill()
        .map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            aria-current={page === i + 1 ? "page" : null}
            className="w-[2vh] h-[2vh] rounded-[100%] px-[0.5vh] bg-black text-[white] text-[1vh] hover:bg-[tomato] hover:cursor-pointer translate-y-[-2px] aria-[current]:bg-green-500 aria-[current]:font-bold"
          >
            {i + 1}
          </button>
        ))}
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === numPages}
        className="h-full disabled:text-gray-400 disabled:cursor-default"
      >
        &gt;
      </button>
    </>
  );
}

export default Pagination;
