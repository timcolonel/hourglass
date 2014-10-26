class WebShot
  attr_accessor :options

  def initialize(options = {})
    @headless = Headless.new
    @headless.start

    @options = default_options.merge(options)

    @driver = Selenium::WebDriver.for(@options[:driver])
    @driver.manage.window.resize_to(@options[:viewport_width], @options[:viewport_heigth])
  end

  def screenshot(url, output)
    @driver.navigate.to(url)
    @driver.save_screenshot(output)
  end

  # Generate thumbnails of the given url
  # @param url: url to screenshot
  # @param output: output file, if nil return the file object
  def thumbnails(url, output=nil)
    file = Tempfile.new('foo')

    #Take a fullsize screenshot and save it in a tmp file
    screenshot(url, file.path)

    #Resize image to a thumbnail
    img = Magick::Image::read(file.path).first
    thumb = img.scale(@options[:thumbnails_width], (@options[:thumbnails_width] * img.rows)/img.columns)
    if output.nil?
      thumb.write(output)
    else
      thumb
    end
  end

  def close
    @driver.quit
    @headless.stop
    @headless.destroy
  end

  private
  def default_options
    {driver: :firefox, thumbnails_width: 256, viewport_width: 1280, viewport_heigth: 800}
  end
end
