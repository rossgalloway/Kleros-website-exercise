export function Scratch() {
  return (
    <>
      <div
        className="content"
        style={{
          alignSelf: 'stretch',
          flex: '1 1 0',
          paddingLeft: 400,
          paddingRight: 400,
          paddingTop: 100,
          paddingBottom: 100,
          background: '#EEEEEE',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          display: 'inline-flex'
        }}
      >
        <div
          style={{
            width: 426,
            alignSelf: 'stretch',
            padding: 30,
            background: 'linear-gradient(331deg, #E0E0E0 0%, #FAE9E9 100%)',
            boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: 20,
            overflow: 'hidden',
            border: '3px white solid',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'inline-flex'
          }}
        >
          {/* complete to here */}
          <div
            className="input-container"
            style={{
              alignSelf: 'stretch',
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 10,
              display: 'flex'
            }}
          >
            <div
              style={{
                alignSelf: 'stretch',
                height: 107,
                padding: 10,
                background: '#6C6C6C',
                boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.25) inset',
                borderRadius: 10,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: 10,
                display: 'flex'
              }}
            >
              <div
                style={{
                  alignSelf: 'stretch',
                  color: '#FF5B5B',
                  fontSize: 12,
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  wordWrap: 'break-word'
                }}
              >
                send:
              </div>
              <div
                style={{
                  alignSelf: 'stretch',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  display: 'inline-flex'
                }}
              >
                <div
                  style={{
                    color: '#ABABAB',
                    fontSize: 24,
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    wordWrap: 'break-word'
                  }}
                >
                  0
                </div>
                <div
                  style={{
                    width: 112,
                    height: 30,
                    paddingLeft: 11,
                    paddingRight: 11,
                    paddingTop: 6,
                    paddingBottom: 6,
                    background: '#D9D9D9',
                    borderRadius: 15,
                    overflow: 'hidden',
                    border: '1px #C26D6D solid',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    display: 'flex'
                  }}
                >
                  <div
                    style={{
                      color: '#5B5B5B',
                      fontSize: 12,
                      fontFamily: 'Inter',
                      fontWeight: '700',
                      wordWrap: 'break-word'
                    }}
                  >
                    select token
                  </div>
                </div>
              </div>
              <div
                style={{
                  alignSelf: 'stretch',
                  height: 22,
                  textAlign: 'right',
                  color: '#D6D6D6',
                  fontSize: 12,
                  fontFamily: 'Inter',
                  fontWeight: '400',
                  wordWrap: 'break-word'
                }}
              >
                balance: 0
              </div>
            </div>
            <div
              style={{
                alignSelf: 'stretch',
                height: 75,
                padding: 10,
                background: '#6C6C6C',
                boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.25) inset',
                borderRadius: 10,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: 10,
                display: 'flex'
              }}
            >
              <div
                style={{
                  alignSelf: 'stretch',
                  color: '#FF5B5B',
                  fontSize: 12,
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  wordWrap: 'break-word'
                }}
              >
                To:
              </div>
              <div
                style={{
                  width: 346,
                  height: 30,
                  paddingTop: 6,
                  paddingBottom: 6,
                  background: '#6C6C6C',
                  borderRadius: 5,
                  overflow: 'hidden',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 10,
                  display: 'inline-flex'
                }}
              >
                <div
                  style={{
                    color: '#ABABAB',
                    fontSize: 24,
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    wordWrap: 'break-word'
                  }}
                >
                  Address or ENS (0x....)
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              alignSelf: 'stretch',
              height: 45,
              paddingLeft: 110,
              paddingRight: 110,
              paddingTop: 7,
              paddingBottom: 7,
              background: 'linear-gradient(90deg, #FFBCBC 0%, #FF5B5B 100%)',
              boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.25)',
              borderRadius: 10,
              overflow: 'hidden',
              border: '1px #C26D6D solid',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              display: 'flex'
            }}
          >
            <div
              style={{
                textAlign: 'center',
                color: 'white',
                fontSize: 24,
                fontFamily: 'Inter',
                fontWeight: '700',
                wordWrap: 'break-word'
              }}
            >
              SEND
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          alignSelf: 'stretch',
          height: 50,
          paddingLeft: 64,
          paddingRight: 64,
          paddingTop: 4,
          paddingBottom: 4,
          background: '#EEEEEE',
          borderTop: '1px #C26D6D solid',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 322,
          display: 'inline-flex'
        }}
      >
        <div
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            display: 'flex'
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              background: '#D9D9D9',
              borderRadius: 10
            }}
          />
          <div
            style={{
              width: 30,
              height: 30,
              background: '#D9D9D9',
              borderRadius: 10
            }}
          />
          <div
            style={{
              width: 30,
              height: 30,
              background: '#D9D9D9',
              borderRadius: 10
            }}
          />
          <div
            style={{
              width: 30,
              height: 30,
              background: '#D9D9D9',
              borderRadius: 10
            }}
          />
        </div>
      </div>
    </>
  )
}

export default Scratch
