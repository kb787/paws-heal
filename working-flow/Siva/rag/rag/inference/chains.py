# # qa chain 
# memory = ConversationBufferMemory(
#                 memory_key="chat_history",
#                 input_key="input",
#                 return_messages=True,
#                 output_key="output",
#             )
#             # Create the QA chain with the LiteLLM model
#             qa = RetrievalQA.from_chain_type(
#                 llm=self.models.lite_llm,  # Use the function directly
#                 chain_type="stuff",  # or use other chain types based on your needs
#                 retriever=retriever,
#                 verbose=True,
#                 return_source_documents=True,
#             )

#             tools = [
#                 Tool(
#                     name="doc_search_tool",
#                     func=qa,
#                     description="This tool is used to retrieve information from the knowledge base",
#                 )
#             ]

#             # Initialize the agent with the tools and memory
#             agent = initialize_agent(
#                 agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
#                 tools=tools,
#                 llm=self.models.lite_llm,  # Use the LiteLLM model here
#                 memory=memory,
#                 return_source_documents=True,
#                 return_intermediate_steps=True,
#                 agent_kwargs={"system_message": "Your system message here"},
#             )
#             response = agent.run(user_query)

#             print(response)


# simple retreiver approach 

# retriever = vectorstore.as_retriever(
#                 search_type="mmr",
#                 search_kwargs={"k": 3},
#             )
#             nodes = retriever.get_relevant_documents(user_query)
#             sources, pages = self.get_sources(nodes)
#             context = self.format_docs(nodes)

#             pprint(nodes)
#             # Assuming this is part of a larger chain
#             timestamp_prompt = self.prompts.get_timestamp_prompt().format(
#                 query=user_query, transcript=nodes[0].text
#             )
#             response = self.ask_litellm(timestamp_prompt)
#             pprint(response)



# ask_azure_model methodology

# def ask_azure_model(
#         self, query: str, context: str, model: Union[str, None] = None
#     ) -> dict:
#         """
#         Queries the Azure model with a given query and context.

#         Parameters
#         ----------
#         query : str
#             The query to send to the Azure model.
#         context : str
#             The context to include in the query to help the model provide a relevant response.
#         model : str or None
#             The model to use for the query. If None, a default model from Azure will be used.

#         Returns
#         -------
#         dict
#             A dictionary containing the response from the Azure model.
#         """

#         if model is None:
#             # Use a default model or configuration
#             model = (
#                 self.models.azure_llm
#             )  # Replace with your actual default model or configuration

#         # Prepare the prompt
#         prompt = self.prompts.get_timestamp_prompt().format(
#             query=query, context=context
#         )

#         # Query the Azure model
#         response = self.models.azure_llm.chat.completions.create(
#             model=model, messages=[{"role": "user", "content": prompt}]
#         )

#         # Pretty print the response for debugging
#         pprint(response)

#         # Extract the content from the response
#         content = response["choices"][0]["message"]["content"].strip()

#         return {
#             "response": content,
#             "usage": response["usage"],
#             "model": response["model"],
#         }
# # response = self.ask_azure_model(query=user_query, context=document_content)
#             # combine_docs_chain = create_stuff_documents_chain(llm, chat_prompt)

#             # retrieval_chain = create_retrieval_chain(retriever, combine_docs_chain)

#             # # Execute the chain with your query and context
#             # response = retrieval_chain.invoke(
#             #     {"query": user_query, "context": document_content}
#             # )


# LLM chain


            # chain = prompt | llm
            # chain = LLMChain(llm=llm, prompt=prompt)
            # response = chain.invoke(
            #     {
            #         "query": user_query,
            #         "context": document_content,
            #     }
            # )



        #     def query_transcripts(self, user_query: str):
        # try:
        #     vector_store_manager = VectorStoreManager(URI=self.URI)
        #     vectorstore = vector_store_manager._get_vector_store("BEST", "youtube")

        #     llm = self.models.azure_llm

        #     search_type = "similarity"
        #     search_kwargs = {"k": 3}
        #     relevant_docs = vectorstore.search(
        #         user_query, search_type=search_type, **search_kwargs
        #     )
        #     # print(relevant_docs[0])
        #     document_content = relevant_docs[0].page_content
        #     prompt = self.prompts.get_timestamp_prompt().format(
        #         query=user_query, context=document_content
        #     )

        #     response = llm.invoke(
        #         input=prompt,
        #         max_tokens=4000,
        #         n=1,
        #         stop=None,
        #         temperature=0,
        #     )

        #     extracted_content = response.content

        #     if extracted_content.strip() == "-1":
        #         logger.info("No timestamp found in the response.")
        #         return {"yt_link": "None", "valid_timestamp": False}

        #     sec = self.time_converter.convert_ts(extracted_content)

        #     if sec is not None:
        #         yt_link = relevant_docs[0].metadata["yt_link"]
        #         yt_link_with_timestamp = f"{yt_link}&t={sec}"
        #         logger.info(f"YouTube Link with Timestamp: {yt_link_with_timestamp}")
        #         return {"yt_link": yt_link_with_timestamp, "valid_timestamp": True}

        #     logger.info("The timestamp conversion returned None.")
        #     return {"yt_link": "None", "valid_timestamp": False}

        # except Exception as e:
        #     logger.error(f"Error extracting timestamp: {e}")
        #     raise