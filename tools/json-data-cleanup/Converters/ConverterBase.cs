﻿using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Html.Parser;
using HtmlAgilityPack;
using Newtonsoft.Json;
using System.Data;

namespace ProcessSeedData.Converters
{
    public abstract class ConverterBase
    {
        public string? SourceFile { get; set; }
        public string? DestinationFile { get; set; }

        public ConverterBase(string sourceFile, string destinationFile)
        {
            this.SourceFile = sourceFile;
            this.DestinationFile = destinationFile;
        }

        public string GetDataPath()
        {
            var folder = AppContext.BaseDirectory;
            var path = new DirectoryInfo(folder);

            while (path.Parent != null && !path.FullName.ToLower().EndsWith(@"\tools"))
            {
                path = new DirectoryInfo(path.Parent.FullName);
            }

            return path.FullName.Replace(@"\tools", @"\src\cms\data");
        }

        public T ReadRawFile<T>() where T: new()
        {
            var rawFilePath = $@"Z:\_shared\json\{SourceFile}";
            Console.WriteLine("Reading " + rawFilePath);

            string rawJson = File.ReadAllText(rawFilePath);

            if (string.IsNullOrWhiteSpace(rawJson))
            {
                throw new DataException($"{rawFilePath} contains no data");
            }

            return JsonConvert.DeserializeObject<T>(rawJson) ?? new T { };
        }

        public void WriteProcessedFile<T>(T newObj)
        {
            string dataPath = GetDataPath();

            string newJson = JsonConvert.SerializeObject(newObj, Formatting.Indented, new JsonSerializerSettings
            {
                StringEscapeHandling = StringEscapeHandling.Default
            });

            var newFilePath = $@"{dataPath}\{DestinationFile}";

            Console.WriteLine($"Writing {newFilePath}");
            Console.WriteLine($"");

            File.WriteAllText(newFilePath, newJson);
        }

        public string ProcessHtml(string input)
        {
            // wrap plain text strings in <p> tags
            input = input.Trim();
            if (input.Length > 0 && !input.Contains("<"))
            {
                input = $"<p>{input}</p>";
            }

            // update these links for easier matching later
            input = input.Replace("../../../planning/", "/planning/");

            // parse the html with HtmlAgilityPack
            var htmlDoc = new HtmlDocument();
            htmlDoc.LoadHtml(input);

            // remove html comments
            htmlDoc.DocumentNode.Descendants()
                 .Where(n => n.NodeType == HtmlAgilityPack.HtmlNodeType.Comment)
                 .ToList()
                 .ForEach(n => n.Remove());

            // remove css classes and ids
            htmlDoc.DocumentNode.Descendants()
                 .ToList()
                 .ForEach(n => { 
                     n.Attributes.Remove("class");
                     n.Attributes.Remove("id");
                 });

            input = htmlDoc.DocumentNode.OuterHtml;

            // parse the html again with AngleSharp
            var p = new HtmlParser();
            var dom = p.ParseDocument(string.Empty);
            var nodes = p.ParseFragment(input, dom.Body);

            // remove images
            var images = nodes.QuerySelectorAll("img");
            foreach (var img in images)
            {
                img.Remove();
            }

            // remove scripts
            var scripts = nodes.QuerySelectorAll("script");
            foreach (var script in scripts)
            {
                script.Remove();
            }

            // add a "legacy-link" class to all html anchors 
            var links = nodes.QuerySelectorAll("a");
            foreach (var link in links)
            {
                string href = (link.GetAttribute("href") ?? "").ToLower();
                // planning is a very common link and it will exist on the new site
                if (href == "/planning/")
                {
                    break;
                }
                // remove photo page links
                if (href.StartsWith("photos"))
                {
                    link.Remove();
                }
                // don't add the class to absolute urls or anchor links
                else if (!href.StartsWith("http") && !href.StartsWith("#") && !href.StartsWith("mailto"))
                {
                    link.ClassList.Add("legacy-link");
                }
                // remove anchor links
                else if (href.StartsWith("#"))
                {
                    link.OuterHtml = link.InnerHtml;
                }
            }
            
            // manual string cleanup 
            var html = nodes.ToHtml();

            // remove consecutive spaces
            while(html.Contains("  "))
            {
                html = html.Replace("  ", " ");
            }

            // format the html nicely
            var pretty = p.ParseFragment(html, dom.Body).Prettify();

            // remove empty div tags
            pretty = pretty.Replace("<div>\n</div>", "");

            // remove leading carriage returns
            while (pretty.StartsWith("\n"))
            {
                pretty = pretty.Substring(1);
            }

            // return the formatted html replacing tabs with 2 spaces
            return pretty.Replace("\t", "  ");
        }
    }
}