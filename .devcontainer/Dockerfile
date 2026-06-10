FROM "mcr.microsoft.com/vscode/devcontainers/ruby:2-3.4-trixie"

RUN rm -f /etc/apt/sources.list.d/yarn.list /etc/apt/sources.list.d/yarn*.list || true
RUN apt-get update && apt-get install -y \
    npm \
    yarn \
    build-essential

RUN gem install rails bundler

WORKDIR "/workspace"

# Copy the entrypoint script and make it executable
#COPY entrypoint.sh /usr/local/bin/entrypoint.sh
#RUN chmod +x /usr/local/bin/entrypoint.sh

#ENTRYPOINT [ "entrypoint.sh" ]
CMD ["/bin/sh","-c"]