import streamlit as st
import requests
import httpx

# image_path = "icon.png"
col1, col2 = st.columns([1, 5])

# with col1:
#      st.image(image_path, width=85)

with col2:
    st.markdown(
        "<h1 style='margin-top: -24px;'>Welcome to SiVA.ai</h1>",
        unsafe_allow_html=True,
    )
    st.caption("Your Enterprise-Grade AI Assistant")

if "messages" not in st.session_state:
    st.session_state.messages = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])


def get_ip_address():
    try:
        response = httpx.get("https://httpbin.org/ip")
        response.raise_for_status()
        ip = response.json().get("origin")
        return ip
    except Exception as e:
        st.error(f"Error fetching IP address: {e}")
        return None


prompt = st.chat_input("Ask your HR or any IT Support Question...")
if prompt:
    st.chat_message("user").markdown(prompt)
    st.session_state.messages.append({"role": "user", "content": prompt})

    response = requests.post(
        "http://127.0.0.1:8000/rag/siva/query",
        json={"user_query": prompt, "user_ip": get_ip_address()},
    )

    if response.status_code == 200:
        api_response = response.json()
        response_displayed = api_response["response"]
        source_documents = api_response.get("source_documents", "")
        yt_link = api_response.get("yt_link", None)
    else:
        response_displayed = "Sorry, I couldn't fetch a response. Please try again."
        yt_link = None

    with st.chat_message("assistant"):
        st.markdown(response_displayed)
        if yt_link:
            st.markdown(f"[YouTube video for reference]({yt_link})")

    st.session_state.messages.append(
        {"role": "assistant", "content": response_displayed}
    )
    if yt_link:
        st.session_state.messages.append(
            {
                "role": "assistant",
                "content": f"[YouTube video for reference]({yt_link})",
            }
        )
