CXX = g++
CXXFLAGS = -std=c++17 -Wall -I./webdriverxx/include
LIBS = -lcurl

TARGET = crawl
SRC = naver/NaverClicker.cpp

all: $(TARGET)

$(TARGET): $(SRC)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SRC) $(LIBS)

clean:
	rm -f $(TARGET)
