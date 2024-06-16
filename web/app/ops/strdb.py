import pymysql

class StrDatabase:
    def __init__(self, pw: str):
        self.__db = pymysql.connect(host='127.0.0.1', user='web', password=pw, db='str_capstone')

    def __del__(self):
        self.__db.close()
    
    def __read_db(self, sql: str):
        """데이터베이스에서 데이터를 읽어올 때 사용하는 함수
        
        Args:
            sql (str): str형식으로 입력받는 sql 구문
            
        Returns:
            tuple: 데이터베이스에서 읽어온 tuple 형식의 데이터
        """
        cursor = self.__db.cursor()
        
        cursor.execute(sql)
        
        return cursor.fetchall()
    
    def __write_db(self, sql: str):
        """데이터베이스에 데이터를 조작하고 업데이트하는 함수
        
        Args:
            sql (str): str 형식의 sql 구문
        """
        cursor = self.__db.cursor()
        
        cursor.execute(sql)
        
        self.__db.commit()
    
    def user_insert(self, user_id: str, pw: str, user_name: str):
        """str_user table에 user data를 insert하는 함수
        
        Args:
            user_id (str): 사용자 id
            pw (str): 해시함수로 암호화된 비밀번호
            user_name (str): 사용자 이름(닉네임)
        """
        sql = "INSERT INTO str_user(user_id, pw, user_name) VALUES('" + user_id + "', '" + pw + "', '" + user_name + "');"
        
        self.__write_db(sql)
    
    def user_select(self, user_id: str):
        """str_user table에서 사용자를 찾아 데이터를 반환하는 함수
        
        Args:
            user_id (str): 검색할 user의 id
        
        Returns:
            tuple: 검색된 user의 tuple 형식의 데이터. (user_id, pw, user_name, user_image)
        """
        sql = "SELECT * FROM str_user WHERE user_id = '" + user_id + "';"
        
        return self.__read_db(sql)[0]
    
    def user_update(self, user_id: str, pw: str, user_name: str, user_image: str):
        """str_user table의 데이터를 업데이트하는 함수
        
        Args:
            user_id (str): 업데이트할 사용자의 id
            pw (str): 해시함수로 암호화된 비밀번호
            user_name (str): 사용자 이름(닉네임)
            user_image (str): 사용자의 프로필 사진 경로
        """
        if user_image is not None:
            sql = "UPDATE str_user SET pw='" + pw + "', user_name='" + user_name + "', user_image='" + user_image + "' WHERE user_id='" + user_id + "';"
        else:
            sql = "UPDATE str_user SET pw='" + pw + "', user_name='" + user_name + "' WHERE user_id='" + user_id + "';"
        
        self.__write_db(sql)

    def board_select(self, search_text: str, sort_by: str):
        """게시판 로드를 위해 str_board의 데이터를 search_text 기반 검색, sort_by 기준 정렬

        Args:
            search_text (str): 검색할 키워드
            sort_by (str): 정렬 기준
        
        Returns:
            tuple: 검색, 정렬된 데이터. recent: ((board_id, user_id, board_image, board_title), ...), like/comment: ((board_id, user_id, board_image, board_title, count), ...)
        """
        if sort_by == "like":
            sql = "SELECT b.board_id, b.user_id, b.board_image, b.board_title, COUNT(l.user_id) AS count FROM str_board b LEFT OUTER JOIN str_like l ON b.board_id = l.board_id "
            if search_text != "":
                sql += "WHERE b.board_title LIKE '%" + search_text + "%' OR b.contents LIKE '%" + search_text + "%' "
            sql += "GROUP BY b.board_id ORDER BY count DESC, b.board_id DESC;"
        elif sort_by == "comment":
            sql = "SELECT b.board_id, b.user_id, b.board_image, b.board_title, COUNT(c.comment_id) AS count FROM str_board b LEFT OUTER JOIN str_comment c ON b.board_id = c.board_id "
            if search_text != "":
                sql += "WHERE b.board_title LIKE '%" + search_text + "%' OR b.contents LIKE '%" + search_text + "%' "
            sql += "GROUP BY b.board_id ORDER BY count DESC, b.board_id DESC;"
        else: # recent
            sql = "SELECT board_id, user_id, board_image, board_title FROM str_board "
            if search_text != "":
                sql += "WHERE board_title LIKE '%" + search_text + "%' OR contents LIKE '%" + search_text + "%' "
            sql += "ORDER BY board_id DESC;"
        
        return self.__read_db(sql)
    
    def board_select_user(self, user_id: str):
        """str_board table에서 user_id를 기반으로 검색한 결과를 반환하는 함수

        Args:
            user_id (str): 검색할 사용자 id

        Returns:
            tuple: 사용자 기반 검색 결과. ((board_id, board_image, board title), ...)
        """
        sql = "SELECT board_id, board_image, board_title FROM str_board WHERE user_id = '" + user_id + "' ORDER BY board_id DESC;"
        
        return self.__read_db(sql)
    
    def board_insert(self, user_id: str, board_date: str, board_image: str, board_title: str, contents: str):
        """str_board table에 게시물 데이터를 추가하는 함수
        
        Args:
            user_id (str): 작성자 id
            board_date (str): 작성일자. "YY-MM-DD HH:MM:SS"
            board_image (str): 사진 경로
            board_title (str): 게시물 제목
            contents (str): 게시물 본문 내용
        """
        sql = "INSERT INTO str_board(user_id, board_date, board_image, board_title, contents) VALUES('" + user_id + "', '" + board_date + "', '" + board_image + "', '" + board_title + "', '" + contents + "');"
        
        self.__write_db(sql)
    
    def board_update(self, board_id: int, board_image: str, board_title: str, contents: str):
        """str_board table의 데이터를 업데이트하는 함수
        
        Args:
            board_id (int): 업데이트할 게시물의 id
            board_image (str): 사진 경로
            board_title (str): 사진 제목
            contents (str): 게시물 본문 내용
        """
        sql = "UPDATE str_board SET board_image='" + board_image + "', board_title='" + board_title + "', contents='" + contents + "' WHERE board_id='" + str(board_id) + "';"
        
        self.__write_db(sql)
    
    def board_delete(self, board_id: int):
        """str_board table의 게시물 데이터를 삭제하는 함수
        
        Args:
            board_id (int): 삭제할 게시물의 id
        """
        sql = "DELETE FROM str_board WHERE board_id=" + str(board_id) + ";"
        
        self.__write_db(sql)
    
    def savebox_select(self, user_id: str):
        """str_savebox table에서 사용자의 보관함 데이터를 반환하는 함수
        
        Args:
            user_id (str): 사용자의 id
        
        Returns:
            tuple: 사용자의 보관함 데이터. ((savebox_id, savebox_image), ...)
        """
        sql = "SELECT savebox_id, savebox_image FROM str_savebox WHERE user_id='" + user_id + "';"
        
        return self.__read_db(sql)
    
    def savebox_insert(self, user_id: str, savebox_image: str):
        """str_savebox table에 사용자의 사진을 추가하는 함수
        
        Args:
            user_id (str): 사용자 id
            savebox_image (str): 추가할 사진 경로
        """
        sql = "INSERT INTO str_savebox(user_id, savebox_image) VALUES('" + user_id + "', '" + savebox_image + "');"
        
        self.__write_db(sql)
    
    def savebox_delete(self, savebox_id: int):
        """str_savebox table에서 사용자의 사진을 삭제하는 함수
        
        Args:
            savebox_id (int): 삭제할 보관함 데이터의 id
        """
        sql = "DELETE FROM str_savebox WHERE savebox_id=" + str(savebox_id) + ";"
        
        self.__write_db(sql)
    
    def board_one(self, board_id: int, user_id: str):
        """str_board의 한 게시물 데이터에 관련된 데이터들를 반환하는 함수
        
        Args:
            board_id (int): 게시물 id
            user_id (str): 해당 내용을 조회하는 사용자 id
        
        Returns:
            dictionary: 게시물에 관련된 데이터 dictionary. {'board_data': board_data, 'user_data': user_data, 'like_count': like_count, 'comment_data': comment_data, 'like_user_data': like_user_data}
        """
        board_sql = "SELECT * FROM str_board WHERE board_id=" + str(board_id) + ";"
        board_data = self.__read_db(board_sql)[0]
        
        user_sql = "SELECT user_id, user_name, user_image FROM str_user WHERE user_id = '" + board_data[1] + "';"
        user_data = self.__read_db(user_sql)[0]
        
        like_sql = "SELECT COUNT(*) FROM str_like WHERE board_id=" + str(board_id) + ";"
        like_count = int(self.__read_db(like_sql)[0][0])
        
        comment_sql = "SELECT c.comment_id, c.user_id, u.user_name, u.user_image, c.contents FROM str_comment c, str_user u WHERE c.user_id=u.user_id AND board_id=" + str(board_id) + " ORDER BY c.comment_id;"
        comment_data = self.__read_db(comment_sql)
        
        like_user_sql = "SELECT * FROM str_like WHERE board_id=" + str(board_id) + " AND user_id='" + user_id + "';"
        like_user_data = len(self.__read_db(like_user_sql))
        
        return {'board_data': board_data, 'user_data': user_data, 'like_count': like_count, 'comment_data': comment_data, 'like_user_data': like_user_data}
    
    def like_insert(self, board_id: int, user_id: str):
        """str_like table에 데이터를 추가하여 좋아요를 추가하는 함수
        
        Args:
            board_id (int): 게시물 id
            user_id (str): 좋아요를 누르는 사용자 id
        """
        sql = "INSERT INTO str_like(board_id, user_id) VALUES(" + str(board_id) + ", '" + user_id + "');"
        
        self.__write_db(sql)
    
    def like_delete(self, board_id: int, user_id: str):
        """str_like table에서 데이터를 삭제하여 좋아요를 취소하는 함수
        
        Args:
            board_id (int): 게시물 id
            user_id (str): 좋아요를 취소하는 사용자 id
        """
        sql = "DELETE FROM str_like WHERE board_id=" + str(board_id) + " AND user_id='" + user_id + "';"
        
        self.__write_db(sql)
    
    def comment_insert(self, board_id: int, user_id: str, contents: str):
        """str_comment에 댓글 데이터를 추가하는 함수
        
        Args:
            board_id (int): 게시물 id
            user_id (str): 댓글을 작성하는 사용자 id
            contents (str): 댓글 내용
        """
        sql = "INSERT INTO str_comment(board_id, user_id, contents) VALUES(" + str(board_id) + ", '" + user_id + "', '" + contents + "');"
        
        self.__write_db(sql)
    
    def comment_delete(self, comment_id: int):
        """str_comment table에서 댓글 데이터를 삭제하는 함수
        
        Args:
            comment_id (int): 댓글 id
        """
        sql = "DELETE FROM str_comment WHERE comment_id=" + str(comment_id) + ";"
        
        self.__write_db(sql)
