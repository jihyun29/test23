import { useEffect } from "react";

export function useRoulette({
  // isTitleLoading,
  isRoulette,
  titleList,
  roulette,
  title,
}) {
  useEffect(() => {
    const colors = ["#919191", "#C6C6C6"];
    // console.log(isTitleLoading);
    // console.log(isRoulette);
    // && !isTitleLoading
    // if (isRoulette) {
    const canvasRef = roulette.current;
    console.log(canvasRef);
    const canvas = canvasRef.getContext(`2d`);

    const newMake = async () => {
      // 캔버스의 중앙점 구하기
      const [cw, ch] = [canvasRef.width / 2, canvasRef.height / 2];
      console.log(cw, ch);
      const arc = Math.PI / 4;
      // 룰렛 배경 항목 수에 따라 그리기 : 8개
      for (let i = 0; i < 8; i++) {
        // 그리기 시작
        canvas.beginPath();
        // 해당 위치에 넣을 색상 지정
        canvas.fillStyle = colors[i % 2];
        // 중앙점으로 이동
        canvas.moveTo(cw, ch);
        // 호 그리기
        // arc(x,y,r, startAngle, endAngle, anticlockwise)
        // x좌표, y좌표, 반지름, 호의 시작점, 끝점을 각도(라디안 값)로 표시, 그릴 때 반시계 방향으로 그릴지 여부
        canvas.arc(cw, ch, cw, arc * i, arc * (i + 1), false);
        canvas.fill();
        canvas.closePath();
      }
      canvas.fillStyle = "white";
      canvas.textAlign = "center";
      canvas.font = "24px SUITE-Variable";

      // 아이템 표기
      for (let i = 0; i < 8; i++) {
        const angle = arc * i + arc / 2;

        canvas.save();

        canvas.translate(
          cw + Math.cos(angle) * (cw - 75),
          ch + Math.sin(angle) * (ch - 75)
        );
        canvas.rotate(angle + Math.PI);
        canvas.fillText(titleList.current[i], 0, i, 140);
        canvas.restore();
      }
    };
    newMake();
    // }
  }, [isRoulette, titleList]);
  // isRoulette, titleList, title, roulette
}
