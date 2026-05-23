import tkinter as tk


class MainView:
    # MainView = 실제 화면(UI)을 구성하는 클래스
    # Tkinter 위젯(Label, Button 등)을 여기서 배치함
    def __init__(self, root):
        self.root = root  # Tkinter의 메인 윈도우 객체

        # 창 기본 설정
        self.root.title("자판기프로그램")
        self.root.geometry("400x600")  # 창 크기
        self.root.resizable(False, False)  # 크기 고정

        # 메인 프레임임
        self.main_frame = tk.Frame(root)
        self.main_frame.pack(fill="both", expand=True)
        # 안내 문구(Label)
        self.label = tk.Label(root, text="자판기 프로그램")
        self.label.pack()  # 화면에 배치

        # 테스트 버튼 (기능은 아직 없음)
        self.button = tk.Button(root, text="테스트 버튼")
        self.button.pack()  # 화면에 배치


# 프로그램 실행 시작점 역할 함수
def start_app():
    # Tkinter 메인 윈도우 생성
    root = tk.Tk()

    # MainView(UI 화면) 생성
    app = MainView(root)

    # Tkinter 이벤트 루프 시작 (창 유지)
    root.mainloop()