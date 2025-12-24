class WebsocketController < ApplicationController
  # include Tubesock::Hijack

  # def websocket
  # 	hijack do |tubesock|
  #     # Listen on its own thread
  #     redis_thread = Thread.new do
  #       # Needs its own redis connection to pub
  #       # and sub at the same time
  #       Redis.new.subscribe "active_record" do |on|
  #         on.message do |channel, message|
  #           tubesock.send_data message
  #         end
  #       end
  #     end
      
  #     tubesock.onclose do
  #       # stop listening when client leaves
  #       redis_thread.kill
  #     end
  #   end
  # end

  def websocket
    # Implement Active Cable https://www.heroku.com/blog/real_time_rails_implementing_websockets_in_rails_5_with_action_cable/
  end

end
